<template>
  <div class="form-page">
    <DynamicForm :schema="schema" v-model="formData" :rules="rules" ref="schemaFormRef">
      <template #select1="{ model }">
        <el-input v-model="model.select1"></el-input>
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
      type: 'IconPicker',
      fieldName: 'icon',
      label: 'IconPicker',
    },
    {
      type: 'ApiSelect',
      componentProps: {},
      fieldName: 'api',
      label: 'ApiSelect',
    },
    {
      type: 'ApiTreeSelect',
      componentProps: {
        childrenField: 'children',
        labelField: 'name',
        valueField: 'path',
      },
      fieldName: 'apiTree',
      label: 'ApiTreeSelect',
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
        triggerFields: ['text1'],
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
