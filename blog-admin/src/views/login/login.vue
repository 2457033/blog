<script lang="ts" setup>
import { postLogin } from '@/api/login'
import { userInfo } from '@/pinia'
import { makeStringMap } from '@/shared/props'
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const ruleFormRef = ref<FormInstance>()

const userInfoStore = userInfo()
const { updateToken } = userInfoStore

const getRuleForm = () => ({
  ...makeStringMap('userName', 'password'),
  loading: false
})

const ruleForm = reactive({
  ...getRuleForm()
})

const rules = reactive<FormRules>({
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 20,
      message: '用户名大于3个或小于20个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})

const onSubmit = async () => {
  await ruleFormRef.value?.validate(async () => {
    try {
      ruleForm.loading = true
      const res = await postLogin({
        userName: ruleForm.userName,
        password: ruleForm.password
      })
      const token = res.data.token
      if (token) {
        const { redirect } = route.query
        localStorage.setItem('user_token', token)
        updateToken(token)
        if (redirect) {
          router.replace({
            name: redirect.toString()
          })
        } else {
          router.push({
            name: 'home'
          })
        }
        ruleForm.loading = false
        ElMessage.success('登录成功')
      } else {
        ruleForm.loading = false
        ElMessage.error('登录失败，请重新登录')
      }
    } catch (err) {
      console.log(err)
      ruleForm.loading = false
    }
  })
}
</script>
<template>
  <div class="main">
    <div class="main__login w-[400px] h-[240px]">
      <ElForm
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        style="max-width: 400px"
        @keyup.enter="onSubmit"
      >
        <ElFormItem
          label="用户名:"
          prop="userName"
          required
        >
          <ElInput
            v-model="ruleForm.userName"
            placeholder="请输入用户名"
          />
        </ElFormItem>
        <ElFormItem
          label="密码:"
          prop="password"
          required
        >
          <ElInput
            v-model="ruleForm.password"
            show-password
            placeholder="请输入密码"
          />
        </ElFormItem>

        <ElFormItem class="w-full">
          <ElButton
            type="primary"
            class="w-full"
            size="large"
            :loading="ruleForm.loading"
            @click="onSubmit"
          >
            登录
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main {
  background-image: url('../../assets/bg.jfif');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__login {
    background-color: #fff;
    padding: 30px;
    border-radius: 20px;
  }
}
</style>
