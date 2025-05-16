import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, ViewStyle, TextStyle, Switch, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import axios from 'axios';

type RootStackParamList = {
  Schedule: undefined;
  Profile: undefined;
};

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  description?: string;
  createdAt: string;
  order: number;
  isTemplate?: boolean;
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  reminder?: {
    enabled: boolean;
    time: string;
    type: 'notification' | 'email';
  };
}

interface TaskTemplate {
  id: string;
  title: string;
  category: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  time?: string;
}

interface TasksType {
  [key: string]: Task[];
}

interface DayType {
  dateString: string;
}

interface ScheduleProps {
}

const CATEGORIES = {
  NEW_YEAR_PLAN: "new year plan",
  DAILY_TASKS: "daily tasks",
  CALENDAR: "calendar",
  MEETING: "meeting",
  PROJECT: "project",
  PERSONAL: "personal",
};

const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

const REPEAT_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

const REMINDER_TYPES = {
  NOTIFICATION: 'notification',
  EMAIL: 'email',
} as const;

const TAGS = [
  'work',
  'personal',
  'meeting',
  'deadline',
  'urgent',
  'follow-up',
  'review',
  'planning',
  'project',
  'routine',
  'health',
  'social',
];

const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: 'template-1',
    title: 'Daily Standup',
    category: CATEGORIES.MEETING,
    priority: PRIORITIES.MEDIUM,
    tags: ['meeting', 'work'],
    time: '09:00',
  },
  {
    id: 'template-2',
    title: 'Exercise',
    category: CATEGORIES.PERSONAL,
    priority: PRIORITIES.MEDIUM,
    tags: ['health', 'routine'],
    time: '07:00',
  },
  {
    id: 'template-3',
    title: 'Project Review',
    category: CATEGORIES.PROJECT,
    priority: PRIORITIES.HIGH,
    tags: ['project', 'review'],
    time: '14:00',
  },
];

const screenWidth = Dimensions.get('window').width;

const API_BASE_URL = 'http://localhost:8080';

export default function Schedule({}: ScheduleProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const isSchedulePage = route.name === 'schedule';
  const [selectedDate, setSelectedDate] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.DAILY_TASKS);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<TasksType>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [repeatType, setRepeatType] = useState<typeof REPEAT_TYPES[keyof typeof REPEAT_TYPES]>(REPEAT_TYPES.NONE);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderType, setReminderType] = useState<typeof REMINDER_TYPES[keyof typeof REMINDER_TYPES]>(REMINDER_TYPES.NOTIFICATION);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddText, setQuickAddText] = useState("");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const onDayPress = (day: DayType) => {
    setSelectedDate(day.dateString);
  };

  const fetchTasks = async () => {
    try {
      console.log('Fetching all tasks');
      const response = await axios.get(`${API_BASE_URL}/api/user-private-task/list`);
      
      // 详细记录响应数据结构
      console.log('=== API Response Details ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data?.data);
      console.log('Response data.data.records:', response.data?.data?.records);
      
      if (response.data?.data?.records) {
        const tasksByDate: TasksType = {};
        
        // 处理任务记录
        const tasksArray = response.data.data.records;
        console.log('Number of tasks:', tasksArray.length);
        
        // 处理每个任务
        tasksArray.forEach((task: any, index: number) => {
          console.log(`Processing task ${index + 1}:`, task);
          
          if (!task.taskDate) {
            console.warn(`Task ${index + 1} missing taskDate:`, task);
            return;
          }
          
          const taskDate = task.taskDate;
          if (!tasksByDate[taskDate]) {
            tasksByDate[taskDate] = [];
          }

          // 转换任务格式以匹配前端显示需求
          const formattedTask: Task = {
            id: task.id?.toString() || Date.now().toString(),
            title: task.taskTitle || 'Untitled Task',
            category: CATEGORIES.DAILY_TASKS,
            completed: task.taskStatus === 'completed',
            dueDate: task.taskDate,
            time: task.startTime,
            priority: task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low',
            tags: [],
            description: task.taskDescription || '',
            createdAt: task.createTime || new Date().toISOString(),
            order: tasksByDate[taskDate].length,
            repeatType: REPEAT_TYPES.NONE,
            reminder: {
              enabled: false,
              time: '',
              type: REMINDER_TYPES.NOTIFICATION,
            },
          };

          console.log(`Formatted task ${index + 1}:`, formattedTask);
          tasksByDate[taskDate].push(formattedTask);
        });

        console.log('Final tasks by date:', tasksByDate);
        console.log('Number of dates with tasks:', Object.keys(tasksByDate).length);
        
        setTasks(tasksByDate);
      } else {
        console.log('No tasks data found in response');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
      }
      Alert.alert('Error', 'Failed to fetch tasks');
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, task);
      
      if (response.data.success) {
        const newTask = response.data.data.task;
        setTasks((prevTasks) => {
          const dateTaskList = [...(prevTasks[newTask.dueDate] || []), newTask];
          return {
            ...prevTasks,
            [newTask.dueDate]: dateTaskList,
          };
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
      return false;
    }
  };

  const updateTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        completed
      });

      if (response.data.success) {
        const updatedTask = response.data.data.task;
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };
          const taskIndex = newTasks[updatedTask.dueDate]?.findIndex(
            task => task.id === taskId
          );
          
          if (taskIndex !== undefined && taskIndex !== -1) {
            newTasks[updatedTask.dueDate][taskIndex] = updatedTask;
          }
          
          return newTasks;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (taskId: string, dueDate: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);

      if (response.data.success) {
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };
          newTasks[dueDate] = newTasks[dueDate].filter(task => task.id !== taskId);
          return newTasks;
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task');
      return false;
    }
  };

  useEffect(() => {
    fetchTasks(); // 初始加载

    // 每5分钟刷新一次任务
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 300000); // 300000ms = 5分钟

    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);

  const addTask = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }

    const currentTime = new Date().toISOString();
    const taskData = {
      completionTime: null,
      createBy: 0,
      createTime: currentTime,
      endTime: taskTime || "23:59:59",
      id: 0,
      priority: selectedPriority === 'high' ? 3 : selectedPriority === 'medium' ? 2 : 1,
      startTime: taskTime || "00:00:00",
      taskDate: selectedDate,
      taskDescription: taskDescription || "",
      taskStatus: "in_progress",
      taskTitle: taskTitle || "New Task",
      updateBy: 0,
      updateTime: currentTime,
      userId: 0
    };

    try {
      console.log('Creating task with data:', {
        ...taskData,
        selectedDate
      });
      
      const response = await axios.post(`${API_BASE_URL}/api/user-private-task`, taskData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Task creation response:', response.data);
      
      if (response.data?.data) {
        // Update local state with the new task
        const newTask: Task = {
          id: response.data.data.id?.toString() || Date.now().toString(),
          title: taskTitle || "New Task",
          category: selectedCategory,
          completed: false,
          dueDate: selectedDate,
          time: taskTime,
          priority: selectedPriority,
          tags: selectedTags,
          description: taskDescription,
          createdAt: currentTime,
          order: tasks[selectedDate]?.length || 0,
          repeatType: repeatType,
          reminder: {
            enabled: reminderEnabled,
            time: reminderTime,
            type: reminderType,
          },
        };

        setTasks((prevTasks) => {
          const dateTaskList = [...(prevTasks[selectedDate] || []), newTask];
          return {
            ...prevTasks,
            [selectedDate]: dateTaskList,
          };
        });

        // Reset form
        setTaskTitle("");
        setTaskTime("");
        setTaskDescription("");
        setSelectedPriority('medium');
        setSelectedTags([]);
        setRepeatType(REPEAT_TYPES.NONE);
        setReminderEnabled(false);
        setReminderTime("");
        setReminderType(REMINDER_TYPES.NOTIFICATION);
        setShowTaskForm(false);
      } else {
        console.error('Invalid response format:', response.data);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      }
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const toggleTaskComplete = async (dateString: string, taskId: string) => {
    try {
      console.log('Toggling task status:', { dateString, taskId });
      // 将 taskId 转换为整数
      const taskIdInt = parseInt(taskId, 10);
      if (isNaN(taskIdInt)) {
        console.error('Invalid task ID:', taskId);
        Alert.alert('Error', 'Invalid task ID');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/api/user-private-task/${taskIdInt}/status`);
      
      console.log('Status update response:', response.data);
      
      if (response.data?.data !== undefined) {
        // 更新本地状态
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };
          const taskIndex = newTasks[dateString]?.findIndex(
            task => task.id === taskId
          );
          
          if (taskIndex !== undefined && taskIndex !== -1) {
            newTasks[dateString] = [...newTasks[dateString]];
            newTasks[dateString][taskIndex] = {
              ...newTasks[dateString][taskIndex],
              completed: response.data.data
            };
          }
          
          return newTasks;
        });

        // 更新选中任务列表
        setSelectedTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: response.data.data }
              : task
          )
        );
      } else {
        console.error('Invalid response format:', response.data);
        Alert.alert('Error', 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      }
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const showAllTasks = (dateString: string) => {
    setSelectedTasks(tasks[dateString] || []);
    setModalVisible(true);
  };

  const navigateToSchedule = () => {
    navigation.navigate('Schedule');
  };

  const dayComponent = ({ date, state, marking }: any) => {
    const dateString = date.dateString;
    const dayTasks = tasks[dateString] || [];
    const isSelected = dateString === selectedDate;
    const maxVisibleTasks = 3;
    const hasMoreTasks = dayTasks.length > maxVisibleTasks;
    
    return (
      <TouchableOpacity 
        onPress={() => onDayPress(date)}
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
          dayTasks.length > 0 && styles.hasTasksDay
        ]}>
        <View style={styles.dayHeader}>
          <Text style={[
            styles.dayText,
            state === 'disabled' && styles.disabledText,
            isSelected && styles.selectedText,
            dayTasks.length > 0 && styles.hasTasksDayText
          ]}>
            {date.day}
          </Text>
        </View>
        <View style={styles.taskContainer}>
          {dayTasks.slice(0, maxVisibleTasks).map((task, index) => (
            <TouchableOpacity
              key={`${task.id}-${index}`}
              onPress={() => toggleTaskComplete(dateString, task.id)}
              style={[
                styles.taskItem,
                task.completed && styles.completedTaskItem,
                task.priority === 'high' && styles.highPriorityTask,
                task.priority === 'medium' && styles.mediumPriorityTask,
                task.priority === 'low' && styles.lowPriorityTask
              ]}
            >
              <View style={styles.taskTimeContainer}>
                {task.time && (
                  <Text style={[
                    styles.taskTime,
                    task.completed && styles.completedTaskText
                  ]}>
                    {task.time}
                  </Text>
                )}
              </View>
              <View style={styles.taskContentContainer}>
                <Text 
                  numberOfLines={1} 
                  style={[
                    styles.cellTaskText,
                    task.completed && styles.completedTaskText
                  ]}
                >
                  {task.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {hasMoreTasks && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => showAllTasks(dateString)}
            >
              <Text style={styles.moreButtonText}>
                +{dayTasks.length - maxVisibleTasks} more
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleQuickAdd = async () => {
    console.log("yes");
    
    if (quickAddText.trim() === "" || selectedDate === "") return;

    const taskData = {
      completionTime: "2025-05-16T16:25:16.097Z",
      createBy: 0,
      createTime: "2025-05-16T16:25:16.097Z",
      endTime: "14:30:00",
      id: 0,
      priority: 0,
      startTime: "13:30:00",
      taskDate: "2025-05-16",
      taskDescription: "string",
      taskStatus: "in_progress",
      taskTitle: "string",
      updateBy: 0,
      updateTime: "2025-05-16T16:25:16.097Z",
      userId: 0
    };

    try {
      console.log('Sending quick task data:', JSON.stringify(taskData, null, 2));
      const response = await axios.post(`${API_BASE_URL}/api/user-private-task`, taskData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Full API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data?.data);
      
      if (response.data?.data) {
        // Update local state with the new task
        const newTask: Task = {
          id: response.data.data.id?.toString() || Date.now().toString(),
          title: quickAddText,
          category: CATEGORIES.DAILY_TASKS,
          completed: false,
          dueDate: selectedDate,
          priority: 'low',
          tags: [],
          description: "",
          createdAt: new Date().toISOString(),
          order: tasks[selectedDate]?.length || 0,
          repeatType: REPEAT_TYPES.NONE,
          reminder: {
            enabled: false,
            time: '',
            type: REMINDER_TYPES.NOTIFICATION,
          },
        };

        setTasks((prevTasks) => {
          const dateTaskList = [...(prevTasks[selectedDate] || []), newTask];
          return {
            ...prevTasks,
            [selectedDate]: dateTaskList,
          };
        });

        // Reset form
        setQuickAddText("");
        setShowQuickAdd(false);
      } else {
        console.error('Invalid response format:', response.data);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating quick task:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      }
      Alert.alert('Error', 'Failed to create quick task');
    }
  };

  const createTaskFromTemplate = (template: TaskTemplate) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: template.title,
      category: template.category,
      completed: false,
      dueDate: selectedDate,
      time: template.time,
      priority: template.priority,
      tags: template.tags,
      description: template.description,
      createdAt: new Date().toISOString(),
      order: tasks[selectedDate]?.length || 0,
      isTemplate: false,
      repeatType: REPEAT_TYPES.NONE,
      reminder: {
        enabled: false,
        time: '',
        type: REMINDER_TYPES.NOTIFICATION,
      },
    };

    setTasks((prevTasks) => {
      const dateTaskList = [...(prevTasks[selectedDate] || []), newTask];
      return {
        ...prevTasks,
        [selectedDate]: dateTaskList,
      };
    });

    setShowTemplates(false);
  };

  const renderQuickAddForm = () => {
    return (
      <View style={styles.quickAddContainer}>
        <TextInput
          style={styles.quickAddInput}
          value={quickAddText}
          onChangeText={setQuickAddText}
          placeholder="Quick add task..."
          placeholderTextColor="#666"
          onSubmitEditing={handleQuickAdd}
        />
        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={handleQuickAdd}
        >
          <Text style={styles.quickAddButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTemplates = () => {
    return (
      <View style={styles.templatesContainer}>
        <Text style={styles.templatesTitle}>Task Templates</Text>
        <ScrollView style={styles.templatesList}>
          {DEFAULT_TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateItem}
              onPress={() => createTaskFromTemplate(template)}
            >
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateCategory}>{template.category}</Text>
              {template.time && (
                <Text style={styles.templateTime}>{template.time}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRepeatSettings = () => {
    return (
      <View style={styles.repeatContainer}>
        <Text style={styles.sectionTitle}>Repeat</Text>
        <View style={styles.repeatOptions}>
          {Object.values(REPEAT_TYPES).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.repeatOption,
                repeatType === type && styles.repeatOptionActive,
              ]}
              onPress={() => setRepeatType(type)}
            >
              <Text style={[
                styles.repeatOptionText,
                repeatType === type && styles.repeatOptionTextActive,
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderReminderSettings = () => {
    return (
      <View style={styles.reminderContainer}>
        <Text style={styles.sectionTitle}>Reminder</Text>
        <View style={styles.reminderOptions}>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: '#767577', true: 'rgb(255, 136, 0)' }}
            thumbColor={reminderEnabled ? '#fff' : '#f4f3f4'}
          />
          {reminderEnabled && (
            <>
              <TextInput
                style={styles.reminderTimeInput}
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="Reminder time"
                placeholderTextColor="#666"
              />
              <View style={styles.reminderTypeContainer}>
                {Object.values(REMINDER_TYPES).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.reminderTypeOption,
                      reminderType === type && styles.reminderTypeOptionActive,
                    ]}
                    onPress={() => setReminderType(type)}
                  >
                    <Text style={[
                      styles.reminderTypeText,
                      reminderType === type && styles.reminderTypeTextActive,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderTaskForm = () => {
    return (
      <View style={styles.taskFormContainer}>
        <View style={styles.formHeader}>
          <TouchableOpacity
            style={styles.templateButton}
            onPress={() => setShowTemplates(!showTemplates)}
          >
            <Text style={styles.templateButtonText}>
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => setShowQuickAdd(!showQuickAdd)}
          >
            <Text style={styles.quickAddButtonText}>
              {showQuickAdd ? 'Full Form' : 'Quick Add'}
            </Text>
          </TouchableOpacity>
        </View>

        {showQuickAdd ? (
          renderQuickAddForm()
        ) : (
          <>
            <TextInput
              style={[styles.input, styles.titleInput]}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Task title..."
              placeholderTextColor="#666"
            />
            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputWrapper}>
                <TouchableOpacity
                  style={styles.timeDropdownButton}
                  onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  <TextInput
                    style={styles.timeInput}
                    value={taskTime}
                    onChangeText={setTaskTime}
                    placeholder="Time (HH:MM)"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                  <View style={styles.dropdownIconContainer}>
                    <Text style={styles.dropdownIcon}>v</Text>
                  </View>
                </TouchableOpacity>
                {showTimeDropdown && (
                  <>
                    <TouchableOpacity
                      style={styles.dropdownOverlay}
                      activeOpacity={0}
                      onPress={() => setShowTimeDropdown(false)}
                    />
                    <View style={styles.timeDropdownContainer}>
                      <ScrollView style={styles.timeDropdownList}>
                        {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                          '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'].map((time) => (
                          <TouchableOpacity
                            key={time}
                            style={[
                              styles.timeDropdownItem,
                              taskTime === time && styles.timeDropdownItemActive
                            ]}
                            onPress={() => {
                              setTaskTime(time);
                              setShowTimeDropdown(false);
                            }}
                          >
                            <Text style={[
                              styles.timeDropdownItemText,
                              taskTime === time && styles.timeDropdownItemTextActive
                            ]}>
                              {time}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </>
                )}
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Description (optional)..."
              placeholderTextColor="#666"
              multiline
            />
            <View style={styles.prioritySelector}>
              {Object.values(PRIORITIES).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    selectedPriority === priority && styles.priorityButtonActive,
                  ]}
                  onPress={() => setSelectedPriority(priority)}
                >
                  <Text style={[
                    styles.priorityText,
                    selectedPriority === priority && styles.priorityTextActive,
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tagsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagButton,
                      selectedTags.includes(tag) && styles.tagButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    <Text style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextActive,
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {renderRepeatSettings()}
            {renderReminderSettings()}
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setShowTaskForm(false)}
              >
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.addButton]}
                onPress={addTask}
              >
                <Text style={styles.formButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showTemplates && renderTemplates()}
      </View>
    );
  };

  const renderTaskStats = () => {
    if (!selectedDate || !tasks[selectedDate]) {
      return (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>No tasks for selected date</Text>
        </View>
      );
    }

    const dayTasks = tasks[selectedDate];
    const completedTasks = dayTasks.filter(task => task.completed).length;
    const pendingTasks = dayTasks.length - completedTasks;
    
    const priorityStats = {
      high: dayTasks.filter(task => task.priority === 'high').length,
      medium: dayTasks.filter(task => task.priority === 'medium').length,
      low: dayTasks.filter(task => task.priority === 'low').length,
    };

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Task Statistics</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Total Tasks:</Text>
          <Text style={styles.statsValue}>{dayTasks.length}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Completed:</Text>
          <Text style={[styles.statsValue, { color: 'rgb(75, 181, 67)' }]}>{completedTasks}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Pending:</Text>
          <Text style={[styles.statsValue, { color: 'rgb(255, 136, 0)' }]}>{pendingTasks}</Text>
        </View>
        <Text style={styles.statsSubtitle}>Priority Distribution</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>High:</Text>
          <Text style={[styles.statsValue, { color: '#ff4444' }]}>{priorityStats.high}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Medium:</Text>
          <Text style={[styles.statsValue, { color: '#ffbb33' }]}>{priorityStats.medium}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Low:</Text>
          <Text style={[styles.statsValue, { color: '#00C851' }]}>{priorityStats.low}</Text>
        </View>
      </View>
    );
  };

  const handleDeleteTask = async (taskId: string, dueDate: string) => {
    try {
      await deleteTask(taskId, dueDate);
      // ... 更新本地状态
    } catch (error) {
      // ... 错误处理
    }
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    
    Object.keys(tasks).forEach(date => {
      const dateTasks = tasks[date];
      const completedCount = dateTasks.filter(task => task.completed).length;
      const totalCount = dateTasks.length;
      
      marked[date] = {
        marked: true,
        dotColor: completedCount === totalCount ? 'green' : 'orange',
        selected: date === selectedDate,
        selectedColor: 'rgb(255, 136, 0)',
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: 'rgb(255, 136, 0)',
      };
    }

    return marked;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        dayComponent={dayComponent}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: "#000",
          calendarBackground: "rgb(43,36,49)",
          textSectionTitleColor: "#fff",
          selectedDayBackgroundColor: "rgb(255, 136, 0)",
          selectedDayTextColor: "#fff",
          todayTextColor: "#FF4500",
          dayTextColor: "#fff",
          textDisabledColor: "#555",
          arrowColor: "#fff",
          monthTextColor: "#fff",
          textDayFontWeight: "bold",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "bold",
          'stylesheet.calendar.main': {
            week: {
              flexDirection: 'row',
              justifyContent: 'space-around',
              height: 'auto',
              minHeight: 90,
              paddingHorizontal: 2,
              marginBottom: 2,
              borderSpacing: 0,
              gap: 2,
            } as ViewStyle,
            container: {
              width: '95%',
              paddingHorizontal: 2,
              paddingVertical: 2,
            } as ViewStyle,
            dayContainer: { 
              flex: 1,
              margin: 1,
              padding: 0,
              borderWidth: 0,
              marginVertical: 1,
            } as ViewStyle
          },
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 10,
              paddingRight: 10,
              marginTop: 4,
              marginBottom: 4,
              alignItems: 'center',
            } as ViewStyle,
            monthText: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff',
            } as TextStyle,
            dayHeader: {
              marginTop: 2,
              marginBottom: 2,
              flex: 1,
              textAlign: 'center',
              fontSize: 14,
              color: '#fff',
              marginHorizontal: 0,
            } as TextStyle,
          }
        }}
      />

      {isSchedulePage && (
        <View style={styles.taskSection}>
          <View style={styles.taskSectionHeader}>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setShowTaskForm(true)}
            >
              <Text style={styles.addTaskButtonText}>+ Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statsButton}
              onPress={() => setShowStats(!showStats)}
            >
              <Text style={styles.statsButtonText}>
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </Text>
            </TouchableOpacity>
          </View>

          {showStats && renderTaskStats()}
          {showTaskForm && (
            <View style={styles.taskFormWrapper}>
              <View style={styles.taskFormHeader}>
                <Text style={styles.taskFormTitle}>Add New Task</Text>
                <TouchableOpacity
                  onPress={() => setShowTaskForm(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
              </View>
              {renderTaskForm()}
            </View>
          )}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate}</Text>
            <ScrollView style={styles.modalTaskList}>
              {selectedTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.modalTaskItem,
                    task.completed && styles.modalTaskItemCompleted
                  ]}
                  onPress={() => toggleTaskComplete(task.dueDate, task.id)}
                >
                  <View style={styles.taskTimeContainer}>
                    {task.time && (
                      <Text style={[
                        styles.taskTime,
                        task.completed && styles.completedTaskText
                      ]}>{task.time}</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.modalTaskText,
                    task.completed && styles.completedTaskText
                  ]}>
                    {task.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  titleContainer: {
    padding: 15,
    backgroundColor: 'rgba(30, 144, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 5,
  },
  viewMoreText: {
    color: '#1E90FF',
    fontSize: 14,
    opacity: 0.8,
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'orange',
    marginBottom: 20,
    paddingBottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgb(43,36,49)',
    height: 'auto',
    width: '100%',
    alignSelf: 'center',
  },
  dayContainer: {
    flex: 1,
    padding: 1,
    minHeight: 90,
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 1,
  },
  hasTasksDay: {
    backgroundColor: 'rgba(255, 136, 0, 0.05)',
    borderColor: 'rgba(255, 136, 0, 0.2)',
  },
  selectedDay: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgb(255, 182, 98)',
  },
  dayText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    padding: 1,
  },
  hasTasksDayText: {
    color: 'rgb(255, 136, 0)',
  },
  taskContainer: {
    flex: 1,
    marginTop: 2,
    overflow: 'hidden',
    gap: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    minHeight: 24,
    marginBottom: 2,
  },
  completedTaskItem: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    opacity: 0.7,
  },
  highPriorityTask: {
    borderLeftWidth: 2,
    borderLeftColor: '#ff4444',
  },
  mediumPriorityTask: {
    borderLeftWidth: 2,
    borderLeftColor: '#ffbb33',
  },
  lowPriorityTask: {
    borderLeftWidth: 2,
    borderLeftColor: '#00C851',
  },
  taskTimeContainer: {
    width: 45,
    marginRight: 8,
  },
  taskTime: {
    color: '#FF9500',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTaskText: {
    color: '#fff',
    fontSize: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'rgb(43,36,49)',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
    marginBottom: 15,
  },
  titleInput: {
    height: 45,
    fontSize: 16,
    fontWeight: '500',
  },
  timeInputContainer: {
    marginBottom: 15,
    position: 'relative',
    zIndex: 2,
  },
  timeInputWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  timeDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
    height: 45,
    zIndex: 2,
  },
  timeInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 14,
  },
  dropdownIconContainer: {
    width: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 136, 0, 0.3)',
  },
  dropdownIcon: {
    color: 'rgb(255, 136, 0)',
    fontSize: 16,
    fontWeight: 'bold',
    transform: [{ scaleX: 1.5 }],
  },
  dropdownOverlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  timeDropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 999,
  },
  timeDropdownList: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timeDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeDropdownItemActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
  },
  timeDropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
  timeDropdownItemTextActive: {
    color: 'rgb(255, 136, 0)',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'rgb(43,36,49)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgb(255, 136, 0)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTaskList: {
    maxHeight: '80%',
  },
  modalTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTaskItemCompleted: {
    backgroundColor: 'rgba(255, 136, 0, 0.05)',
  },
  modalTaskText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  modalCloseButton: {
    backgroundColor: 'rgb(255, 136, 0)',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#fff',
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: 'rgb(255, 136, 0)',
    borderColor: 'rgb(255, 136, 0)',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: 'rgba(255, 136, 0, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgb(255, 136, 0)',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
  },
  categoryTextActive: {
    fontWeight: 'bold',
  },
  taskItemText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    color: 'rgb(255, 136, 0)',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
  },
  moreButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.2)',
    padding: 2,
    borderRadius: 2,
    marginTop: 2,
    alignItems: 'center',
  },
  moreButtonText: {
    color: 'rgb(255, 136, 0)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  quickAddInput: {
    flex: 1,
    height: 45,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  quickAddButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(255, 136, 0)',
  },
  quickAddButtonText: {
    color: 'rgb(255, 136, 0)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  templatesContainer: {
    padding: 10,
  },
  templatesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  templatesList: {
    maxHeight: 200,
  },
  templateItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  templateTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  templateCategory: {
    color: '#fff',
    fontSize: 12,
  },
  templateTime: {
    color: '#fff',
    fontSize: 10,
  },
  repeatContainer: {
    padding: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  repeatOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  repeatOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginRight: 8,
  },
  repeatOptionActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderColor: 'rgb(255, 136, 0)',
  },
  repeatOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  repeatOptionTextActive: {
    color: 'rgb(255, 136, 0)',
    fontWeight: 'bold',
  },
  reminderContainer: {
    padding: 10,
  },
  reminderOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTimeInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
  },
  reminderTypeContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  reminderTypeOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  reminderTypeOptionActive: {
    backgroundColor: 'rgb(255, 136, 0)',
  },
  reminderTypeText: {
    color: '#fff',
    fontSize: 12,
  },
  reminderTypeTextActive: {
    fontWeight: 'bold',
  },
  taskFormContainer: {
    padding: 10,
    position: 'relative',
    zIndex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  templateButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  templateButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  prioritySelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  priorityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginRight: 8,
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderColor: 'rgb(255, 136, 0)',
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
  },
  priorityTextActive: {
    color: 'rgb(255, 136, 0)',
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tagButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginRight: 8,
  },
  tagButtonActive: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderColor: 'rgb(255, 136, 0)',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  tagTextActive: {
    color: 'rgb(255, 136, 0)',
    fontWeight: 'bold',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 0,
  },
  formButton: {
    width: 100,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
  },
  addButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
  },
  formButtonText: {
    color: 'rgb(255, 136, 0)',
    fontSize: 15,
    fontWeight: '600',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: 'rgb(43,36,49)',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addTaskButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(255, 136, 0)',
  },
  addTaskButtonText: {
    color: 'rgb(255, 136, 0)',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsButton: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(255, 136, 0)',
  },
  statsButtonText: {
    color: 'rgb(255, 136, 0)',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  taskFormWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  taskFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskFormTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskSection: {
    backgroundColor: 'rgb(43,36,49)',
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  taskSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 136, 0, 0.3)',
  },
  statsContainer: {
    padding: 15,
    backgroundColor: 'rgba(43, 36, 49, 0.8)',
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 136, 0, 0.3)',
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  statsValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  disabledText: {
    color: '#555',
  },
  selectedText: {
    color: 'rgb(255, 136, 0)',
  },
});

