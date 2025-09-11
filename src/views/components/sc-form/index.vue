<template>
  <div class="schema-form-example">
    <h2 class="example-title">SchemaForm 示例</h2>
    <div class="form-container">
      <SchemaForm
        ref="schemaFormRef"
        :schemas="formSchema"
        v-model="formData"
        :label-width="120"
        @submit="handleSubmit"
      >
        <template #customSlotField="{ path }">
          <SlotComponent v-model="formData.slot1" :path="path"></SlotComponent>
        </template>
      </SchemaForm>

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
  import { ref, onMounted, h } from 'vue';
  import SchemaForm from '@/components/schema-form/index.vue';

  import HelloWorld from './helloword.vue';
  import HelloWorld1 from './helloword1.vue';
  import SlotComponent from './slotComponent.vue';
  import type { FormParams, Schema } from '@/components/types/Form.ts';
  // 表单数据
  const formData = ref({
    hasCar: false,
    contacts: [
      {
        name: '李四',
        phone: '13800138000',
        relation: 'friend',
      },
    ],
    address: {
      province: undefined,
      city: undefined,
      detail: 'xxx',
    },
    skills: ['Vue', 'TypeScript'],
  });

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
      name: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      span: 12,
    },
    {
      type: 'slot',
      name: 'slot1',
      slotName: 'customSlotField',
      label: 'slot字段',
      required: true,
      span: 12,
    },
    {
      name: 'age',
      type: 'number',
      label: () =>
        h(
          'span',
          {
            style: 'color: red',
          },
          'a12312',
        ),
      placeholder: '请输入年龄',
      rules: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        { type: 'number', min: 18, max: 120, message: '年龄必须在18-120之间', trigger: 'blur' },
      ],
      span: 12,
      componentProps: {
        controlsPosition: 'right',
      },
    },
    {
      name: 'city',
      type: 'select',
      label: '城市',
      options: cityOptions,
      placeholder: '请选择城市',
      rules: [{ required: true, message: '请选择城市', trigger: 'change' }],
    },
    {
      name: 'job',
      type: 'select',
      label: '职业',
      options: fetchJobOptions, // 远程加载选项
      placeholder: '请选择职业',
    },
    {
      name: 'hasCar',
      type: 'switch',
      label: '是否有车',
      componentProps: {
        activeText: '有',
        inactiveText: '无',
      },
    },
    {
      name: 'carName',
      type: 'input',
      label: '汽车名称',
      componentProps: {
        activeText: '有',
        inactiveText: '无',
      },
      dependencies: {
        visible: ({ formData, path }) => {
          if (formData.hasCar) {
            return true;
          }
          return false;
        },
        triggerFields: ['hasCar'],
      },
    },
    {
      name: 'joinDate',
      type: 'date',
      label: '入职日期',
      placeholder: '请选择入职日期',
      rules: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
    },

    // 对象类型示例
    {
      name: 'address',
      type: 'object',
      label: '家庭地址',
      fields: [
        {
          name: 'province',
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
          name: 'city',
          type: 'select',
          label: '城市',
          options: cityOptions,
          rules: [{ required: true, message: '请选择城市', trigger: 'change' }],
        },
        {
          name: 'detail',
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
      name: 'contacts',
      type: 'array',
      label: '紧急联系人',
      addText: '添加联系人',
      removeText: '删除',
      minLength: 1,
      maxLength: 3,
      getDefaultItem: () => [{ name: '', phone: '', relation: '' }],
      item: {
        type: 'object',
        fields: [
          {
            name: 'name',
            type: 'input',
            label: '姓名',
            rules: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
          },
          {
            name: 'phone',
            type: 'input',
            label: '电话',
            rules: [
              { required: true, message: '请输入联系电话', trigger: 'blur' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
            ],
          },
        ],
      },
    },
    {
      name: 'name2',
      type: 'custom',
      component: HelloWorld,
      label: 'HelloWorld',
      span: 12,
    },
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
  onMounted(() => {});
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
