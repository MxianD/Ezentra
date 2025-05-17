const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SubmissionManager", function () {
  let submissionManager;
  let senate;
  let owner;
  let senator1;
  let senator2;
  let senator3;
  let member;
  const communityId = 1;
  
  beforeEach(async function () {
    // 部署 Senate 合约
    const Senate = await ethers.getContractFactory("Senate");
    senate = await Senate.deploy();

    // 部署 SubmissionManager 合约
    const SubmissionManager = await ethers.getContractFactory("SubmissionManager");
    submissionManager = await SubmissionManager.deploy(await senate.getAddress());

    [owner, senator1, senator2, senator3, member] = await ethers.getSigners();

    // 设置参议员
    await senate.addSenator(senator1.address, 0); // 假设 category 0
    await senate.addSenator(senator2.address, 0);
    await senate.addSenator(senator3.address, 0);
  });

  describe("提交内容", function () {
    it("应该能够成功提交内容", async function () {
      const contentUrl = "https://example.com/content";
      await expect(submissionManager.connect(member).submitContent(communityId, contentUrl, 0))
        .to.emit(submissionManager, "SubmissionCreated")
        .withArgs(communityId, member.address, contentUrl);
    });

    it("不能提交空 URL", async function () {
      await expect(
        submissionManager.connect(member).submitContent(communityId, "", 0)
      ).to.be.revertedWith("Content URL cannot be empty");
    });
  });

  describe("评分", function () {
    const contentUrl = "https://example.com/content";
    
    beforeEach(async function () {
      await submissionManager.connect(member).submitContent(communityId, contentUrl, 0); // MUSIC 类别
    });

    it("参议员应该能够提交评分", async function () {
      await expect(submissionManager.connect(senator1).submitScore(communityId, member.address, 80))
        .to.emit(submissionManager, "ScoreSubmitted")
        .withArgs(communityId, member.address, senator1.address, 80);
    });

    it("非参议员不能提交评分", async function () {
      await expect(
        submissionManager.connect(owner).submitScore(communityId, member.address, 80)
      ).to.be.revertedWith("Not authorized senator");
    });

    it("评分不能超过100", async function () {
      await expect(
        submissionManager.connect(senator1).submitScore(communityId, member.address, 101)
      ).to.be.revertedWith("Score must be between 0 and 100");
    });

    it("参议员不能重复评分", async function () {
      await submissionManager.connect(senator1).submitScore(communityId, member.address, 80);
      await expect(
        submissionManager.connect(senator1).submitScore(communityId, member.address, 90)
      ).to.be.revertedWith("Already scored by this senator");
    });

    it("所有参议员评分后应该计算最终分数", async function () {
      // 第一个参议员评分
      console.log("\n评分详情：");
      await submissionManager.connect(senator1).submitScore(communityId, member.address, 80);
      console.log(`Senator 1 评分：80`);
      
      // 第二个参议员评分
      await submissionManager.connect(senator2).submitScore(communityId, member.address, 90);
      console.log(`Senator 2 评分：90`);
      
      // 第三个参议员评分，应该触发最终分数计算
      await submissionManager.connect(senator3).submitScore(communityId, member.address, 85);
      console.log(`Senator 3 评分：85`);
      
      // 获取并验证最终分数
      const [finalScore, isScored] = await submissionManager.getFinalScore(communityId, member.address);
      console.log(`\n最终分数：${finalScore}`);
      
      // 获取每个评分者的信誉度
      const reputation1 = await submissionManager.scorerInfo(senator1.address);
      const reputation2 = await submissionManager.scorerInfo(senator2.address);
      const reputation3 = await submissionManager.scorerInfo(senator3.address);
      
      console.log(`\n评分者信誉度：`);
      console.log(`Senator 1: ${reputation1.reputation}`);
      console.log(`Senator 2: ${reputation2.reputation}`);
      console.log(`Senator 3: ${reputation3.reputation}\n`);
      
      expect(isScored).to.be.true;
      expect(finalScore).to.be.gt(0);
    });
  });
});
