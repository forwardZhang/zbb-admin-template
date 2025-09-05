<template>
  <div class="form-page">
    {{ formData }}
    <DynamicForm :fields="fields" v-model="formData" ref="schemaFormRef"> </DynamicForm>
  </div>
</template>

<script setup lang="ts">
  import DynamicForm from '@/components/dynamic-form/index.vue';
  import { ref } from 'vue';
  const fields = [
    {
      label: '姓名',
      fieldName: 'userData.name',
      type: 'text',
      required: true,
    },
    {
      label: '年龄',
      fieldName: 'userData.age',
      type: 'number',
    },
    {
      type: 'array',
      label: '联系方式',
      fieldName: 'contacts',
      items: {
        type: 'object',
        properties: [
          {
            type: 'select',
            label: '类型',
            fieldName: 'type',
            span: 8,
            componentProps: {
              options: [
                { label: '手机', value: 'phone' },
                { label: '邮箱', value: 'email' },
              ],
            },
          },
          {
            type: 'text',
            label: '值',
            fieldName: 'value',
            span: 16,
          },
        ],
      },
    },
    {
      label: '文本类',
      fieldName: 'text1',
      type: 'text',
    },
    {
      label: '数字类',
      fieldName: 'number1',
      type: 'number',

      dependencies: {
        if({ formValues }) {
          return formValues?.userData?.contacts?.length >= 3;
        },
        // disabled: ({ formValues, formApi }) => {
        //   return formValues.radioButton === 'B';
        // },
        // trigger: ({ formValues }) => {
        //   if (formValues.radioButton === 'B') {
        //     formValues.string = '123';
        //   }
        // },
        triggerFields: ['text1', 'userData.contacts'],
      },
      onChange: (value) => {
        console.log('onChange', value);
      },
    },
    {
      label: '选择框',
      fieldName: 'select1',
      type: 'select',
      required: true,
      source: {
        labelField: 'label',
        valueField: 'value',
        options: [
          {
            label: '选项A',
            value: 'A',
          },
          {
            label: '选项B',
            value: 'B',
          },
          {
            label: '选项C',
            value: 'C',
          },
        ],
      },
      // componentProps: {
      //   filterable: true,
      //   options: [
      //     {
      //       value: 'A',
      //       label: '选项A',
      //     },
      //     {
      //       value: 'B',
      //       label: '选项B',
      //     },
      //     {
      //       value: 'C',
      //       label: '选项C',
      //     },
      //   ],
      // },
    },
  ];

  const formData = ref({
    checkbotton: ['A', 'B'],
    string: 'xxxxx',
    userData: {
      name: 'xxx',
      age: 12,
      contacts: [
        {
          type: '',
          text: '',
        },
      ],
    },
  });
  const rules = {
    number: [{ required: true, message: '请输入数字', trigger: 'change' }],
  };

  const schemaFormRef = ref();

  function submit() {
    schemaFormRef.value
      ?.validate()
      .then(() => {
        console.log('submit');
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  }
</script>

<style scoped lang="scss"></style>
