<template>
  <div class="edit">
  <div class="font">
    <p>请输入标题</p>
  </div>
    <el-form :model="form"
             :rules="addFormRules"
             ref="addFormRules"
             label-width="80px"
             label-position="right">
      <el-input v-model="form.title" placeholder="请输入内容" style="width: 100%"></el-input>
    </el-form>
    <hr>
    <div class="font">
      <span>输入正文</span>
    </div>
    <quilleditor v-model="form.content"
                 ref="myTextEditor"
                 :options="editorOption"
                 @change="onChange"
                 style="background-color: white"
    >
      <div id="toolbar" slot="toolbar">
        <select class="ql-size">
          <option value="small"></option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <span class="ql-formats"><button class="ql-script" value="sub"></button></span>
        <span class="ql-formats"><button class="ql-script" value="super"></button></span>
        <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
        <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
        <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
        <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
        <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
        <span class="ql-formats"><button type="button" class="ql-link"></button></span>
        <span class="ql-formats">
        <button type="button" @click="imgClick" style="outline:none">
        <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle
            class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill"
                                                                    points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
        </button>
      </span>
        <span class="ql-formats"><button type="button" class="ql-video"></button></span>
      </div>
    </quilleditor>
    <el-button @click="editDialogVisible=true" style="float: right">预览</el-button>
    <el-button @click="tijiao" style="float: right">提交</el-button>
    <el-dialog title="预览" :visible.sync="editDialogVisible">
      <p v-html="this.form.content"></p>
    </el-dialog>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from "vue-quill-editor";

export default {
  name: "v-editor",
  props: {
    value: {
      type: String
    },
    /*上传图片的地址*/
    uploadUrl: {
      type: String,
      default: '/test/uploadImg'
    },
    /*上传图片的file控件name*/
    fileName: {
      type: String,
      default: 'file'
    },
    maxUploadSize: {
      type: Number,
      default: 1024 * 1024 * 500
    }
  },
  created() {
    this.test()
  },
  data() {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      editDialogVisible: false,
      form: {
        author: "",
        title: "",
        content: "",
        createtime: "",
      },
      addFormRules: {
        title: [
          {required: true, message: "请输入标题", trigger: 'blur'},
          {min: 2, max: 15, message: "请输入2到15个字符", trigger: "blur"}
        ],
      }
    }
  },
  methods: {
    tijiao() {
      let user = window.sessionStorage.getItem("userInfo")
      this.form.author = JSON.parse(user).username
      this.form.createtime = new Date()
      this.$refs.addFormRules.validate(async valid => {
        if (!valid) return;
        let {data: res} = await this.$http.post("article", this.form);
        if (res !== "success") {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功")
        await this.$router.push("/article")
      })
    },

    onChange() {
      this.$emit('input', this.form.content)
    },
    /*选择上传图片切换*/
    onFileChange(e) {
      var fileInput = e.target;
      if (fileInput.files.length === 0) {
        return
      }
      this.editor.focus();
      if (fileInput.files[0].size > this.maxUploadSize) {
        this.$alert('图片不能大于500KB', '图片尺寸过大', {
          confirmButtonText: '确定',
          type: 'warning',
        })
      }
      var data = new FormData;
      data.append(this.fileName, fileInput.files[0]);
      this.$http.post(this.uploadUrl, data)
          .then(res => {
            if (res.data) {
              console.log(res.data);
              this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.data)
            }
          })
    },
    /*点击上传图片按钮*/
    imgClick() {
      if (!this.uploadUrl) {
        console.log('no editor uploadUrl');
        return;
      }
      /*内存创建input file*/
      var input = document.createElement('input');
      input.type = 'file';
      input.name = this.fileName;
      input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
      input.onchange = this.onFileChange;
      input.click()
    }
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill
    }
  },
  components: {
    'quilleditor': quillEditor
  },
  mounted() {
    this.form.content = this.value
  },
  watch: {
    'value'(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.form.content) {
          this.content = newVal
        }
      }
    },
  }
}
</script>
<style>
.font {
  font-size: 16px;
  margin: 12px auto;
}

.edit {
  /*background-color: white;*/
}
</style>
