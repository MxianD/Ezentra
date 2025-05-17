// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./CommunityTypes.sol";
import "./Senate.sol";

/**
 * @title SubmissionManager
 * @dev 管理社区成员提交的内容和评分
 */
contract SubmissionManager is CommunityTypes {
    Senate public senateContract;

    struct Submission {
        address member;
        uint256 communityId;
        string contentUrl;
        uint256 submitTime;
        bool isScored;
        uint256 finalScore;
        Category category;
    }

    // 提交记录
    mapping(uint256 => mapping(address => Submission)) public submissions;
    
    // 评分记录
    mapping(uint256 => mapping(address => mapping(address => uint256))) public senatorScores;
    mapping(uint256 => mapping(address => address[])) public submissionScorers;

    event SubmissionCreated(uint256 indexed communityId, address indexed member, string contentUrl);
    event ScoreSubmitted(uint256 indexed communityId, address indexed member, address indexed senator, uint256 score);
    event FinalScoreCalculated(uint256 indexed communityId, address indexed member, uint256 finalScore);

    constructor(address _senateAddress) {
        senateContract = Senate(_senateAddress);
    }

    // 提交内容
    function submitContent(
        uint256 _communityId,
        string memory _contentUrl,
        Category _category
    ) external {
        require(bytes(_contentUrl).length > 0, "Content URL cannot be empty");
        require(!submissions[_communityId][msg.sender].isScored, "Already submitted and scored");

        submissions[_communityId][msg.sender] = Submission({
            member: msg.sender,
            communityId: _communityId,
            contentUrl: _contentUrl,
            submitTime: block.timestamp,
            isScored: false,
            finalScore: 0,
            category: _category
        });

        emit SubmissionCreated(_communityId, msg.sender, _contentUrl);
    }

    // 参议员提交评分
    function submitScore(
        uint256 _communityId,
        address _member,
        uint256 _score
    ) external {
        Submission storage submission = submissions[_communityId][_member];
        require(submission.submitTime > 0, "Submission not found");
        require(!submission.isScored, "Already scored");
        require(_score <= 100, "Score must be between 0 and 100");
        Category submissionCategory = submissions[_communityId][_member].category;
        require(senateContract.isSenator(msg.sender, submissionCategory), "Not authorized senator");
        require(senatorScores[_communityId][_member][msg.sender] == 0, "Already scored by this senator");

        senatorScores[_communityId][_member][msg.sender] = _score;
        submissionScorers[_communityId][_member].push(msg.sender);

        emit ScoreSubmitted(_communityId, _member, msg.sender, _score);

        // 检查是否所有参议员都已评分
        if (_checkAllSenatorsScored(_communityId, _member)) {
            _calculateFinalScore(_communityId, _member);
        }
    }

    // 检查是否所有参议员都已评分
    function _checkAllSenatorsScored(
        uint256 _communityId,
        address _member
    ) internal view returns (bool) {
        Category category = submissions[_communityId][_member].category;
        uint256 activeSenatorCount = senateContract.getActiveSenatorCount(category);
        return submissionScorers[_communityId][_member].length >= activeSenatorCount;
    }

    // 评分者信誉度相关的常量
    uint256 public constant INITIAL_REPUTATION = 1000;
    uint256 public constant REPUTATION_INCREASE = 50;
    uint256 public constant REPUTATION_DECREASE = 10;
    uint256 public constant MIN_SCORES_REQUIRED = 3;
    
    // 存储评分者的信息
    struct ScorerInfo {
        uint256 reputation;      // 信誉度
        uint256 totalScores;    // 总评分次数
        bool isInitialized;     // 是否已初始化
    }
    
    // 存储评分者的信誉度和相关信息
    mapping(address => ScorerInfo) public scorerInfo;
    
    // 初始化评分者信息
    function _initializeScorerIfNeeded(address scorer) internal {
        if (!scorerInfo[scorer].isInitialized) {
            scorerInfo[scorer] = ScorerInfo({
                reputation: INITIAL_REPUTATION,
                totalScores: 0,
                isInitialized: true
            });
        }
    }
    
    // 计算最终得分，使用加权平均和异常值处理
    function _calculateFinalScore(uint256 _communityId, address _member) internal {
        address[] storage scorers = submissionScorers[_communityId][_member];
        require(scorers.length >= MIN_SCORES_REQUIRED, "Need at least 3 scores");
        
        // 第一步：收集所有分数并排序
        uint256[] memory scores = new uint256[](scorers.length);
        uint256[] memory weights = new uint256[](scorers.length);
        uint256 totalWeight = 0;
        
        for (uint i = 0; i < scorers.length; i++) {
            address scorer = scorers[i];
            _initializeScorerIfNeeded(scorer);
            
            scores[i] = senatorScores[_communityId][_member][scorer];
            weights[i] = scorerInfo[scorer].reputation;
            totalWeight += weights[i];
            
            // 更新评分次数
            scorerInfo[scorer].totalScores++;
        }
        
        // 第二步：计算加权平均分
        uint256 weightedTotal = 0;
        for (uint i = 0; i < scores.length; i++) {
            weightedTotal += (scores[i] * weights[i]);
        }
        
        uint256 preliminaryScore = weightedTotal / totalWeight;
        
        // 第三步：计算标准差，识别异常值
        uint256 variance = 0;
        for (uint i = 0; i < scores.length; i++) {
            if (scores[i] > preliminaryScore) {
                variance += (scores[i] - preliminaryScore) * (scores[i] - preliminaryScore);
            } else {
                variance += (preliminaryScore - scores[i]) * (preliminaryScore - scores[i]);
            }
        }
        uint256 stdDev = sqrt(variance / scores.length);
        
        // 第四步：重新计算最终分数，排除异常值
        uint256 finalWeightedTotal = 0;
        uint256 finalTotalWeight = 0;
        
        for (uint i = 0; i < scores.length; i++) {
            // 如果分数在平均分的2个标准差范围内
            if (scores[i] <= preliminaryScore + 2 * stdDev && 
                scores[i] >= preliminaryScore - 2 * stdDev) {
                finalWeightedTotal += (scores[i] * weights[i]);
                finalTotalWeight += weights[i];
                
                // 更新评分者信誉度
                // 越接近最终分数，信誉度提升越多
                uint256 scoreDiff = scores[i] > preliminaryScore ? 
                    scores[i] - preliminaryScore : 
                    preliminaryScore - scores[i];
                    
                if (scoreDiff <= stdDev) {
                    // 评分接近平均值，增加信誉度
                    scorerInfo[scorers[i]].reputation += REPUTATION_INCREASE;
                } else {
                    // 评分偏离较大，降低信誉度
                    scorerInfo[scorers[i]].reputation = scorerInfo[scorers[i]].reputation >= REPUTATION_DECREASE ? 
                        scorerInfo[scorers[i]].reputation - REPUTATION_DECREASE : 0;
                }
            }
        }
        
        uint256 finalScore = finalWeightedTotal / finalTotalWeight;
        
        // 更新提交的最终分数
        submissions[_communityId][_member].finalScore = finalScore;
        submissions[_communityId][_member].isScored = true;
        
        emit FinalScoreCalculated(_communityId, _member, finalScore);
    }
    
    // 计算平方根的辅助函数
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        
        return y;
    }

    // 获取提交内容的最终得分
    function getFinalScore(
        uint256 _communityId,
        address _member
    ) external view returns (uint256, bool) {
        Submission storage submission = submissions[_communityId][_member];
        return (submission.finalScore, submission.isScored);
    }

    // 获取特定参议员的评分
    function getSenatorScore(
        uint256 _communityId,
        address _member,
        address _senator
    ) external view returns (uint256) {
        return senatorScores[_communityId][_member][_senator];
    }
}
