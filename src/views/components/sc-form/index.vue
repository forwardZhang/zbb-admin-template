<template>
  <div class="schema-form-example">
    <h2 class="example-title">SchemaForm 示例</h2>
    <div class="form-container">
      <SchemaForm
        ref="schemaFormRef"
        :schemas="formSchema"
        v-model="formData"
        :label-width="120"
        :defaultUseRowCol="true"
        :defaultRowProps="{ gutter: 20 }"
        :defaultColProps="{ span: 12 }"
        @submit="handleSubmit"
      />

      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button @click="handleGetValues">获取值</el-button>
      </div>
    </div>

    <div class="form-result">
      <h3>表单数据:</h3>
      <pre>{{ formData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import SchemaForm from '@/components/schema-form/index.vue';
  import type { Schema } from '@/components/schema-form/types';

  // 表单数据
  const formData = ref({});

  // 表单引用
  const schemaFormRef = ref<any>(null);

  // 选项数据 - 城市列表
  const cityOptions = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
  ];

  // 远程选项示例 - 模拟API请求
  const fetchJobOptions = async () => {
    // 模拟网络请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { label: '前端开发', value: 'frontend' },
      { label: '后端开发', value: 'backend' },
      { label: '产品经理', value: 'product' },
      { label: '设计师', value: 'designer' },
    ];
  };

  // 表单配置Schema
  const formSchema: Schema[] = [
    // 基础组件示例
    {
      field: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      defaultValue: '张三',
      colProps: { span: 24 }, // 占满一行
    },
    {
      field: 'age',
      type: 'number',
      label: '年龄',
      placeholder: '请输入年龄',
      rules: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { type: 'number', min: 18, max: 120, message: '年龄必须在18-120之间', trigger: 'blur' },
      ],
      componentProps: {
        controlsPosition: 'right',
      },
    },
    {
      field: 'gender',
      type: 'radio',
      label: '性别',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
      defaultValue: 'male',
    },
    {
      field: 'hobby',
      type: 'checkbox',
      label: '爱好',
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' },
      ],
      defaultValue: ['reading', 'music'],
    },
    {
      field: 'city',
      type: 'select',
      label: '城市',
      options: cityOptions,
      placeholder: '请选择城市',
      rules: [{ required: true, message: '请选择城市', trigger: 'change' }],
    },
    {
      field: 'job',
      type: 'select',
      label: '职业',
      options: fetchJobOptions, // 远程加载选项
      placeholder: '请选择职业',
      colProps: { span: 24 }, // 占满一行
    },
    {
      field: 'hasCar',
      type: 'switch',
      label: '是否有车',
      componentProps: {
        activeText: '有',
        inactiveText: '无',
      },
    },
    {
      field: 'joinDate',
      type: 'date',
      label: '入职日期',
      placeholder: '请选择入职日期',
      rules: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
    },

    // 对象类型示例
    {
      field: 'address',
      type: 'object',
      label: '家庭地址',
      collapse: true, // 可折叠
      colProps: { span: 24 }, // 占满一行
      properties: [
        {
          field: 'province',
          type: 'select',
          label: '省份',
          options: [
            { label: '北京市', value: 'bj' },
            { label: '上海市', value: 'sh' },
            { label: '广东省', value: 'gd' },
          ],
          rules: [{ required: true, message: '请选择省份', trigger: 'change' }],
        },
        {
          field: 'city',
          type: 'select',
          label: '城市',
          options: cityOptions,
          rules: [{ required: true, message: '请选择城市', trigger: 'change' }],
        },
        {
          field: 'detail',
          type: 'input',
          label: '详细地址',
          placeholder: '请输入详细地址',
          rules: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
          colProps: { span: 24 }, // 占满一行
        },
      ],
    },

    // 数组类型示例 - 联系人列表
    {
      field: 'contacts',
      type: 'array',
      label: '紧急联系人',
      addText: '添加联系人',
      removeText: '删除',
      minLength: 1,
      maxLength: 3,
      colProps: { span: 24 }, // 占满一行
      items: {
        type: 'object',
        properties: [
          {
            field: 'name',
            type: 'input',
            label: '姓名',
            rules: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          },
          {
            field: 'phone',
            type: 'input',
            label: '电话',
            rules: [
              { required: true, message: '请输入联系电话', trigger: 'blur' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
            ],
          },
          {
            field: 'relation',
            type: 'select',
            label: '关系',
            options: [
              { label: '父母', value: 'parent' },
              { label: '配偶', value: 'spouse' },
              { label: '子女', value: 'child' },
              { label: '朋友', value: 'friend' },
            ],
            rules: [{ required: true, message: '请选择关系', trigger: 'change' }],
            colProps: { span: 24 }, // 占满一行
          },
        ],
      },
    },

    // 数组类型示例 - 技能列表
    // {
    //   field: 'skills',
    //   type: 'array',
    //   label: '技能标签',
    //   addText: '添加技能',
    //   removeText: '删除',
    //   colProps: { span: 24 }, // 占满一行
    //   items: {
    //     type: 'input',
    //     placeholder: '请输入技能',
    //   },
    // },
  ];

  // 提交表单
  const handleSubmit = async () => {
    const isValid = await schemaFormRef.value.validate();
    if (isValid) {
      console.log('表单提交:', formData.value);
      // 这里可以添加实际提交逻辑
    }
  };

  // 重置表单
  const handleReset = () => {
    schemaFormRef.value.resetFields();
  };

  // 获取表单值
  const handleGetValues = () => {
    const values = schemaFormRef.value.getFormValue();
    console.log('当前表单值:', values);
  };

  // 初始化
  onMounted(() => {
    // 可以在这里设置初始值
    formData.value = {
      hasCar: true,
      contacts: [
        {
          name: '李四',
          phone: '13800138000',
          relation: 'friend',
        },
      ],
      skills: ['Vue', 'TypeScript'],
    };
  });
</script>

<style scoped>
  .schema-form-example {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .example-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  .form-container {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
  }

  .form-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .form-result {
    background-color: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
  }

  .form-result pre {
    margin: 10px 0 0;
    padding: 10px;
    background-color: #2d2d2d;
    color: #f8f8f2;
    border-radius: 4px;
    overflow-x: auto;
  }
</style>
