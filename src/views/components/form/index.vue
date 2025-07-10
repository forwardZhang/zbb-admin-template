<template>
  <div class="form-page">
    <div>formData:{{ formData }}</div>
    <!--    <SchemaForm ref="schemaFormRef" :schema="schema" :rules="rules" v-model="formData">-->
    <!--      <template #age123> 我是age123 </template>-->
    <!--    </SchemaForm>-->
    <UseSchemaForm>
      <template #age123>dqwdqwdage123</template>
    </UseSchemaForm>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
  import { h, markRaw, ref, useTemplateRef } from 'vue';
  import HelloWorld from './hello-world.vue';
  import useSchemaForm from '@/components/schema-form/hooks/use-schema-form.ts';

  const formData = ref({
    name: '',
    age: null,
  });
  const rules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
    hello: [{ required: true, message: '请输入年龄', trigger: 'change' }],
  };
  const schema: any[] = [
    {
      label: 'hello',
      name: 'hello',
      type: markRaw(HelloWorld),
    },
    {
      label: '姓名',
      name: 'name',
      type: 'input',
      required: true,
      span: 12,
    },
    {
      label: '年龄',
      name: 'age',
      type: 'number',
      required: true,
      props: {
        placeholder: '请输入年龄',
      },
      span: 12,
    },
    {
      label: '插槽年龄',
      name: 'age123',
      slotName: 'age123',
      required: true,
      span: 12,
    },
    {
      name: 'sex1',
      label: '选择框',
      type: 'select',
      required: true,
      props: {
        labelField: 'label',
        valueField: 'id',
        options: [
          {
            label: '男',
            id: '1',
            slots: () => h('div', 'hello world'),
          },
          {
            label: '女',
            id: '2',
          },
        ],
      },
    },
    {
      name: 'sex2',
      label: '选择框',
      type: 'radio',
      required: true,
      props: {
        labelField: 'label',
        valueField: 'id',
        options: [
          {
            label: '男',
            id: '1',
          },
          {
            label: '女',
            id: '2',
          },
        ],
      },
    },
    {
      name: 'sex3',
      label: '选择框',
      type: 'checkbox',
      required: true,
      props: {
        labelField: 'label',
        valueField: 'id',
        options: [
          {
            label: '男',
            id: '1',
          },
          {
            label: '女',
            id: '2',
          },
        ],
      },
    },
  ];
  const { UseSchemaForm, validate } = useSchemaForm({
    schema,
    rules,
    modelValue: formData,
  });
  const schemaFormRef = useTemplateRef<any>('schemaFormRef');

  function submit() {
    validate()
      .then(() => {
        console.log('submit');
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  }
</script>

<style scoped>
  .form-page {
    width: 500px;
    margin: 0 auto;
  }
</style>
