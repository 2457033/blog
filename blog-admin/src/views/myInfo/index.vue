<script lang="ts" setup>
import { getUserInfo } from '@/api/login'
import {
  postUptPwd,
  postUsersUpdate,
  uploadUserUptAvtar
} from '@/api/setting/users'
import { UserInfo, userInfo, useWindow } from '@/pinia'
import { FormInstance, FormRules, UploadFile, UploadFiles } from 'element-plus'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'

import { isHttpOrHttps } from '@/shared/verify'

import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { ossUploadFile } from '@/hook/useOss'

// const { proxy } = getCurrentInstance() as ComponentInternalInstance

const { VITE_BASE_URL } = import.meta.env

const windowStore = useWindow()

const userInfoStore = userInfo()
const { token, userinfo } = storeToRefs(userInfoStore)
const { uptPersonal, uptAvatr } = userInfoStore

const form = reactive({
  info: {} as UserInfo,
  loading: false
})

const getUserInfoApi = async () => {
  const res = await getUserInfo()
  Object.assign(form.info, res.data)
}

const uptPwd = reactive({
  oldPwd: '',
  newPwd: '',
  yesNewPwd: '',
  loading: false
})

const uptInfoRef = ref<FormInstance>()
const uptPwdRef = ref<FormInstance>()

const ToPwd = (_rule: any, value: any, callback: any) => {
  if (uptPwd.oldPwd === value) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

const equalToPwd = (_rule: any, value: any, callback: any) => {
  if (uptPwd.newPwd !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  nickName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入用户昵称'
    }
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入手机号'
    },
    {
      min: 11,
      max: 11,
      message: '手机号格式错误',
      trigger: 'change'
    }
  ],
  oldPwd: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    { required: true, validator: ToPwd, trigger: 'blur' }
  ],
  yesNewPwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPwd, trigger: 'blur' }
  ]
})

// 修改个人资料
const uptInfoClick = () => {
  uptInfoRef.value?.validate().then(async () => {
    try {
      form.loading = true
      await postUsersUpdate({
        id: form.info.id!,
        phone: form.info.phone!,
        nickName: form.info.nickName!,
        sex: form.info.sex!
      })
      form.loading = false
      uptPersonal(form.info)
      ElMessage.success('修改成功')
    } catch (err) {
      form.loading = false
    }
  })
}

// 修改密码
const uptPwdClick = () => {
  uptPwdRef.value?.validate().then(async () => {
    try {
      uptPwd.loading = true
      await postUptPwd({
        oldPwd: uptPwd.oldPwd,
        newPwd: uptPwd.newPwd
      })
      uptPwd.loading = false
      uptPwdCancel()
      ElMessage.success('修改成功')
    } catch (err) {
      uptPwd.loading = false
    }
  })
}

const uptPwdCancel = () => {
  uptPwd.newPwd = ''
  uptPwd.oldPwd = ''
  uptPwd.yesNewPwd = ''
}

const getModal = () => ({
  isShow: false,
  loading: false
})

const modal = reactive({
  ...getModal()
})

const onConfirm = async () => {
  try {
    modal.loading = true
    const result: any = await ossUploadFile(cropperData.file)
    await uploadUserUptAvtar(result.url)
    modal.loading = false
    onCancel()
    uptAvatr(result.url)
    ElMessage.success('上传成功')
  } catch (err) {
    modal.loading = false
    ElMessage.error('上传失败')
  }
}

const onCancel = () => {
  modal.isShow = false
}

const cropperData = reactive({
  img: '',
  uptImg: '',
  info: {} as any,
  file: {} as File
})

const cropperRef = ref()
const onRealTime = () => {
  cropperRef.value?.getCropData((data: any) => {
    // do something
    cropperData.uptImg = data
  })
  cropperRef.value?.getCropBlob((data: any) => {
    // do something
    const file = new File([data], cropperData.info.name, {
      type: data.type, // 设置文件类型（可选）
      lastModified: cropperData.info.lastModified // 设置最后修改时间（可选）
    })
    cropperData.file = file
  })
}

const onChange = (uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
  console.log(uploadFile.raw!)
  cropperData.img = URL.createObjectURL(uploadFile.raw!)
  cropperData.info = uploadFile.raw!
  modal.isShow = true
}

getUserInfoApi()
</script>
<template>
  <div>
    <ElCard
      header="个人信息"
      style="border-radius: 14px"
    >
      <div class="flex items-center">
        <!-- 头像 -->
        <div class="mr-[8%] relative w-[110px] h-[110px] imageStyle">
          <ElImage
            ref="imageRef"
            class="rounded-[50%] w-[110px] h-[110px] z-0 border-[1px] border-inherit"
            :src="
              isHttpOrHttps(userinfo.icon)
                ? userinfo.icon
                : VITE_BASE_URL + userinfo.icon
            "
          ></ElImage>
          <ElUpload
            action="#"
            accept=".jpg, .jpeg, .png, .gif"
            :auto-upload="false"
            :show-file-list="false"
            class="upload w-[110px] h-[110px] rounded-[50%] cursor-pointer absolute top-0 left-0 z-99 bg-black bg-opacity-50 flex items-center justify-center opacity-0 upload-transition"
            @change="onChange"
          >
            <span class="text-white text-[14px]">上传</span>
          </ElUpload>
        </div>
        <!-- 信息 -->
        <ElForm
          class="w-[500px]"
          inline
        >
          <ElFormItem
            label="用户名称："
            prop="userName"
          >
            <span class="font-bold">{{ userinfo.userName }}</span>
          </ElFormItem>
          <ElFormItem label="用户昵称：">
            <span class="font-bold">{{ userinfo.nickName }}</span>
          </ElFormItem>
          <ElFormItem label="手机号码：">
            <span class="font-bold">{{ userinfo.phone || '--' }}</span>
          </ElFormItem>
          <ElFormItem label="用户性别：">
            <span class="font-bold">{{
              userinfo.sex === 'man'
                ? '男'
                : userinfo.sex === 'woman'
                ? '女'
                : '未知'
            }}</span>
          </ElFormItem>
          <ElFormItem label="所属角色：">
            <span class="font-bold">{{ userinfo.roleName || '--' }}</span>
          </ElFormItem>
        </ElForm>
      </div>
    </ElCard>

    <ElCard
      class="mt-[20px]"
      style="border-radius: 14px"
    >
      <ElTabs
        model-value="updinfo"
        class="demo-tabs"
      >
        <ElTabPane
          label="基本资料"
          name="updinfo"
        >
          <ElForm
            ref="uptInfoRef"
            :model="form.info"
            :rules="rules"
            status-icon
          >
            <ElFormItem
              label="用户昵称："
              prop="nickName"
              required
            >
              <ElInput
                v-model="form.info.nickName"
                placeholder="请输入用户昵称"
              />
            </ElFormItem>
            <ElFormItem
              label="手机号码："
              prop="phone"
              required
            >
              <ElInput
                v-model="form.info.phone"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </ElFormItem>
            <ElFormItem label="用户性别：">
              <ElRadioGroup
                class="ml-4"
                v-model="form.info.sex"
              >
                <ElRadio value="unknown">未知</ElRadio>
                <ElRadio value="man">男</ElRadio>
                <ElRadio value="woman">女</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
            <ElSpace>
              <ElButton
                type="primary"
                @click="uptInfoClick"
                :loading="form.loading"
              >
                确认修改
              </ElButton>
            </ElSpace>
          </ElForm>
        </ElTabPane>
        <ElTabPane
          label="修改密码"
          name="updpwd"
        >
          <ElForm
            label-width="95px"
            ref="uptPwdRef"
            :model="uptPwd"
            :rules="rules"
            status-icon
          >
            <ElFormItem
              label="旧密码："
              prop="oldPwd"
              required
            >
              <ElInput
                v-model="uptPwd.oldPwd"
                placeholder="请输入旧密码"
                type="password"
                show-password
              />
            </ElFormItem>
            <ElFormItem
              label="新密码："
              prop="newPwd"
              required
            >
              <ElInput
                v-model="uptPwd.newPwd"
                placeholder="请输入新密码"
                type="password"
                show-password
              />
            </ElFormItem>
            <ElFormItem
              label="确认密码："
              prop="yesNewPwd"
              required
            >
              <ElInput
                v-model="uptPwd.yesNewPwd"
                placeholder="请确认新密码"
                type="password"
                show-password
              />
            </ElFormItem>

            <ElSpace>
              <ElButton
                type="primary"
                @click="uptPwdClick"
                :loading="uptPwd.loading"
              >
                确认修改
              </ElButton>
            </ElSpace>
          </ElForm>
        </ElTabPane>
      </ElTabs>
    </ElCard>
    <Modal
      :model-value="modal.isShow"
      title="修改图像"
      :loading="modal.loading"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      @confirm="onConfirm"
      @cancel="onCancel"
      width="800px"
      confirm-text="上传"
    >
      <div class="flex flex-wrap">
        <!-- 裁剪组件 -->
        <VueCropper
          ref="cropperRef"
          :img="cropperData.img"
          outputType="jpeg, png, webp"
          style="height: 350px; width: 350px"
          :style="{
            width: windowStore.screenWidth > 650 ? '50%' : '100%'
          }"
          fixed
          :fixedNumber="[1, 1]"
          autoCrop
          @realTime="onRealTime"
        />
        <div
          class="h-[350px] flex items-center justify-center"
          :style="{
            width: windowStore.screenWidth > 650 ? '50%' : '100%'
          }"
        >
          <div
            class="h-[250px] w-[250px] rounded-[50%] overflow-hidden border-[1px] border-inherit flex items-center justify-center"
          >
            <img :src="cropperData.uptImg" />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
// .demo-tabs > .el-tabs__content {
//   padding: 32px;
//   color: #6b778c;
//   font-size: 32px;
//   font-weight: 600;
// }
.imageStyle:hover .upload {
  opacity: 1;
}

.upload-transition {
  transition: all 0.5s;
}

:deep(.el-upload--text) {
  width: 100%;
  height: 100%;
}

:deep(.cropper-view-box) {
  border-radius: 50%; /* 设置圆角为 50% 即可形成圆形 */
}
</style>
