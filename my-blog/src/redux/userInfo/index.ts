import { postUserInfo } from '@/api/users'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserInfo {
  createTime: string
  icon: string
  id: string
  nickName: string
  permission?: string
  phone: string
  sex: string
  userName: string
  visitCount: number
  articleCount: number
  likeCount: number
}

export const userInfo = createSlice({
  name: 'userInfo',
  initialState: {
    userInfo: {} as UserInfo,
    token: localStorage.getItem('user_token') ?? ''
  },
  reducers: {
    updateToken: (state, action: PayloadAction<number>) => {
      state.token = action.payload?.toString()
    },
    logoOut: (state) => {
      state.token = ''
      state.userInfo = {} as UserInfo
      localStorage.removeItem('user_token')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserInfo.fulfilled,
        (state, action: PayloadAction<number>) => {
          Object.assign(state.userInfo, action.payload)
        }
      )
      .addCase(getUserInfo.rejected, (state, _action) => {
        state.userInfo = {} as UserInfo
        state.token = ''
        localStorage.removeItem('user_token')
      })
  }
})

export const getUserInfo = createAsyncThunk(
  'userInfo/getUserInfo',
  async () => {
    const res = await postUserInfo()
    const data = res.data
    return data
  }
)

export const { updateToken, logoOut } = userInfo.actions

export default userInfo.reducer
