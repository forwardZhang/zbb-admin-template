<template>
  <div class="app-container">
    <h1>SchemaForm 示例</h1>

    <!-- 使用SchemaForm而不是el-form + SchemaField -->
    <schema-form ref="formRef" :schemas="formSchema" v-model="formData" label-width="120px" />

    <div class="form-operation">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button @click="getFormData">获取数据</el-button>
    </div>

    <div class="form-data">
      <h3>表单数据：</h3>
      <pre>{{ formData }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import SchemaForm from '@/components/schema-form/index.ts';

  const formRef = ref(null);

  // 示例schema配置
  const formSchema = [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      component: 'el-input',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    },
    {
      field: 'gender',
      label: '性别',
      type: 'select',
      component: 'el-select',
      rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' },
      ],
      componentProps: {
        style: 'width: 100%',
      },
    },
    {
      field: 'age',
      label: '年龄',
      type: 'input-number',
      component: 'el-input-number',
      visible: (formData) => formData.gender === 'male',
      placeholder: (formData) => (formData.gender === 'male' ? '请输入年龄' : ''),
      rules: (formData) =>
        formData.gender === 'male'
          ? [{ required: true, message: '年龄不能为空', trigger: 'blur' }]
          : [],
    },
    {
      field: 'address',
      label: '地址信息',
      type: 'object',
      properties: [
        {
          field: 'province',
          label: '省份',
          type: 'select',
          component: 'el-select',
          options: {
            dependencies: [],
            handler: async (formData) => {
              // 模拟异步请求
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([
                    { label: '北京', value: 'beijing' },
                    { label: '上海', value: 'shanghai' },
                    { label: '广东', value: 'guangdong' },
                  ]);
                }, 500);
              });
            },
          },
        },
        {
          field: 'city',
          label: '城市',
          type: 'select',
          component: 'el-select',
          options: {
            dependencies: ['address.province'], // 依赖省份字段
            handler: async (formData) => {
              const province = formData.address?.province;
              if (!province) return [];

              // 根据省份获取城市
              const cities = {
                beijing: [{ label: '北京市', value: 'beijing' }],
                shanghai: [{ label: '上海市', value: 'shanghai' }],
                guangdong: [
                  { label: '广州市', value: 'guangzhou' },
                  { label: '深圳市', value: 'shenzhen' },
                  { label: '东莞市', value: 'dongguan' },
                ],
              };

              return cities[province] || [];
            },
          },
        },
      ],
    },
    {
      field: 'hobbies',
      label: '兴趣爱好',
      type: 'array',
      items: {
        type: 'object',
        defaultValue: { name: '', level: 'beginner' },
        properties: [
          {
            field: 'name',
            label: '爱好名称',
            type: 'input',
            component: 'el-input',
            rules: [{ required: true, message: '爱好名称不能为空', trigger: 'blur' }],
          },
          {
            field: 'level',
            label: '熟练程度',
            type: 'select',
            component: 'el-select',
            options: [
              { label: '初学者', value: 'beginner' },
              { label: '中等', value: 'intermediate' },
              { label: '专家', value: 'expert' },
            ],
          },
        ],
      },
    },
  ];

  const formData = reactive({
    name: '',
    gender: '',
    age: undefined,
    address: {
      province: '',
      city: '',
    },
    hobbies: [],
  });

  const handleSubmit = async () => {
    try {
      // 直接调用SchemaForm的validate方法
      await formRef.value.validate();
      ElMessage.success('表单验证成功!');
      console.log('表单数据:', formData);
    } catch (error) {
      ElMessage.error('表单验证失败，请检查输入!');
    }
  };

  const handleReset = () => {
    // 直接调用SchemaForm的resetFields方法
    formRef.value.resetFields();
    // 同时重置数据
    Object.assign(formData, {
      name: '',
      gender: '',
      age: undefined,
      province: '',
      city: '',
      hobbies: [],
    });
  };

  const getFormData = () => {
    // 获取表单数据
    const data = formRef.value.getFormData();
    console.log('当前表单数据:', data);
    ElMessage.info('已获取表单数据，请查看控制台');
  };
</script>

<style>
  .app-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .form-operation {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }

  .form-data {
    margin-top: 20px;
  }
</style>
