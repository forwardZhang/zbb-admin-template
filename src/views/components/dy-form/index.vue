<template>
  <div class="form-page">
    <DynamicForm :schema="schema" v-model="formData" :rules="rules" ref="schemaFormRef">
      <template #string="{ model }">
        <el-input v-model="model.string"></el-input>
        <!--        <HelloWorld v-model="model.string"></HelloWorld>-->
      </template>
    </DynamicForm>
  </div>
</template>

<script setup lang="ts">
  import DynamicForm from '@/components/dynamic-form/index.vue';
  import { ref } from 'vue';
  const schema = [
    {
      component: 'IconPicker',
      fieldName: 'icon',
      label: 'IconPicker',
    },
    {
      component: 'ApiSelect',
      componentProps: {},
      fieldName: 'api',
      label: 'ApiSelect',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        childrenField: 'children',
        labelField: 'name',
        valueField: 'path',
      },
      fieldName: 'apiTree',
      label: 'ApiTreeSelect',
    },
    {
      component: 'Input',
      fieldName: 'string',
      label: 'String',
    },
    {
      component: 'InputNumber',
      fieldName: 'number',
      label: 'Number',
      dependencies: {
        // if({ formValue }) {
        //   return formValue.radioButton === 'B';
        // },
        disabled: ({ formValues, formApi }) => {
          return formValues.radioButton === 'B';
        },
        trigger: ({ formValues }) => {
          if (formValues.radioButton === 'B') {
            formValues.string = '123';
          }
        },
        triggerFields: ['radioButton'],
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'radio',
      label: 'Radio',
      componentProps: {
        options: [
          {
            value: 'A',
            label: 'A',
          },
          {
            value: 'B',
            label: 'B',
          },
          {
            value: 'C',
            label: 'C',
          },
          {
            value: 'D',
            label: 'D',
          },
          {
            value: 'E',
            label: 'E',
          },
        ],
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'radioButton',
      label: 'RadioButton',
      componentProps: {
        isButton: true,
        options: [
          {
            value: 'A',
            label: '选项A',
          },
          {
            value: 'B',
            label: '选项B',
          },
          {
            value: 'C',
            label: '选项C',
          },
          {
            value: 'D',
            label: '选项D',
          },
          {
            value: 'E',
            label: '选项E',
          },
          {
            value: 'F',
            label: '选项F',
          },
        ],
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox',
      label: 'Checkbox',
      componentProps: {
        options: [
          {
            value: 'A',
            label: '选项A',
          },
          {
            value: 'B',
            label: '选项B',
          },
          {
            value: 'C',
            label: '选项C',
          },
        ],
      },
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox1',
      label: 'Checkbox1',
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbotton',
      label: 'CheckBotton',
      componentProps: {
        isButton: true,
        options: [
          {
            value: 'A',
            label: '选项A',
          },
          {
            value: 'B',
            label: '选项B',
          },
          {
            value: 'C',
            label: '选项C',
          },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      fieldName: 'select',
      label: 'Select',
      required: true,
      componentProps: {
        filterable: true,
        options: [
          {
            value: 'A',
            label: '选项A',
          },
          {
            value: 'B',
            label: '选项B',
          },
          {
            value: 'C',
            label: '选项C',
          },
        ],
      },
    },
  ];

  const formData = ref({
    checkbotton: ['A', 'B'],
    string: 'xxxxx',
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
