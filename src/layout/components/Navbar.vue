<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    
    <breadcrumb class="breadcrumb-container" /> -->
    <div class="nav-logo">
      <img src="@/assets/logo.png" class="nav-img">
    </div>
    
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon icon-class="head" class="user-avatar"/>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
         
          <el-dropdown-item  @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      title: 'Vue Admin Template',

    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(
		#2b8be1, 
		#2b8be1), 
	linear-gradient(90deg, 
		#00da95 0%, 
		#00a0ff 100%), 
	linear-gradient(
		#2b8be1, 
		#2b8be1);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .nav-logo{
    height: 50px;
    line-height: 50px;
    float: left;
    font-size: 0;
    .nav-img{
      display: inline-block;
      padding-left: 12px;
      // vertical-align: middle;
      height: 40px;
      margin-top: 8px;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
   
    .avatar-container {
      margin-right: 31px;
      height: 50px;
      // line-height: 50px;
      .avatar-wrapper {
        height: 50px;
        position: relative;
        // line-height: 50px;
        font-size: 0;
        margin-top: 5px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          // line-height: 50px;
          border-radius: 50%;
          // vertical-align: middle;
          margin-right: 10px;
          color: #fff;  
        }

        .el-icon-caret-bottom {
          position: absolute;
          top: 14px;
          right: -10px;
          cursor: pointer;
          // vertical-align: middle;
          font-size: 14px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
