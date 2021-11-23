<template>
  <div>
    <vue-tinymce
      id="tinymceEditor"
      :key="tinymceEditorKey"
      v-model="myContent"
      :setup="isDesign?setup:noSetup"
      :setting="setting"
    />
  </div>
</template>

<script>
import rsaUtil from '@/utils/rsaUtil'
export default {
  name: 'TinymceEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    isDesign: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myContent: this.content,
      tinymceEditorKey: 1,
      noSetup(editor) {},
      setup(editor) {
        const signatureArr = []
        const remarkArr = []
        const dateArr = []
        for (let i = 1; i < 11; i++) {
          signatureArr.push({
            type: 'nestedmenuitem',
            text: '签名占位' + i,
            getSubmenuItems: function() {
              const items = []
              for (let j = 1; j < 11; j++) {
                items.push({
                  type: 'menuitem',
                  text: i + '-' + j,
                  onAction: function() {
                    editor.insertContent('签名占位' + i + '-' + j)
                  }
                })
              }
              return items
            }
          })
          remarkArr.push({
            type: 'nestedmenuitem',
            text: '备注占位' + i,
            getSubmenuItems: function() {
              const items = []
              for (let j = 1; j < 11; j++) {
                items.push({
                  type: 'menuitem',
                  text: i + '-' + j,
                  onAction: function() {
                    editor.insertContent('备注占位' + i + '-' + j)
                  }
                })
              }
              return items
            }
          })
          dateArr.push({
            type: 'nestedmenuitem',
            text: '日期占位' + i + '-1',
            getSubmenuItems: function() {
              const items = []
              for (let j = 1; j < 11; j++) {
                items.push({
                  type: 'menuitem',
                  text: i + '-' + j,
                  onAction: function() {
                    editor.insertContent('日期占位' + i + '-' + j)
                  }
                })
              }
              return items
            }
          })
        }
        editor.ui.registry.addNestedMenuItem('insert-signature', {
          text: '插入签名占位',
          getSubmenuItems: function() {
            return signatureArr
          }
        })
        editor.ui.registry.addNestedMenuItem('insert-remark', {
          text: '插入备注占位',
          getSubmenuItems: function() {
            return remarkArr
          }
        })
        editor.ui.registry.addNestedMenuItem('insert-date', {
          text: '插入日期占位',
          getSubmenuItems: function() {
            return dateArr
          }
        })
        editor.ui.registry.addMenuItem('insert-dept', {
          text: '部门占位',
          onAction: function() {
            editor.insertContent('部门占位')
          }
        })
        editor.ui.registry.addMenuItem('insert-name', {
          text: '姓名占位',
          onAction: function() {
            editor.insertContent('姓名占位')
          }
        })
        editor.ui.registry.addMenuItem('insert-phone', {
          text: '号码占位',
          onAction: function() {
            editor.insertContent('号码占位')
          }
        })
        editor.ui.registry.addMenuItem('insert-time', {
          text: '时间占位',
          onAction: function() {
            editor.insertContent('时间占位')
          }
        })
      },
      setting: {
        menubar: this.isDesign ? 'file edit insert insertZw view format table tools help' : true,
        menu: {
          insertZw: { title: '插入占位', items: 'insert-signature insert-remark insert-date insert-dept insert-name insert-phone insert-time' }
        },
        contextmenu: this.isDesign ? 'insert-signature insert-remark insert-date insert-dept insert-name insert-phone' : true,
        toolbar_mode: 'wrap', // 工具栏模式wrap默认显示所有工具按钮
        toolbar_sticky: false, // 工具栏停靠顶部
        forced_root_block: '',
        branding: false,
        valid_elements: '*[*]',
        toolbar: [
          'code undo redo restoredraft cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect',
          'preview print importword fullscreen | lineheight bullist numlist blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime'
        ],
        quickbars_selection_toolbar:
          'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins:
          'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em formatpainter axupimgs importword autoresize',
        language: 'zh_CN', // 本地化设置
        // height: 800,
        // autoresize_bottom_margin: 50,
        // autoresize_min_height: 500,
        // autoresize_on_init: true,
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
        importword_handler: function(editor, files, next) {
          const file_name = files[0].name
          if (file_name.substr(file_name.lastIndexOf('.') + 1) === 'docx') {
            editor.notificationManager.open({
              text: '正在转换中...',
              type: 'info',
              closeButton: false
            })
            next(files)
          } else {
            editor.notificationManager.open({
              text: '目前仅支持docx文件格式，若为doc111，请将扩展名改为docx',
              type: 'warning'
            })
          }
          // next(files);
        },
        importword_filter: function(result, insert, message) {
          // 自定义操作部分
          insert(result) // 回插函数
        },
        automatic_uploads: true,
        // 图片异步上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
          const file = blobInfo.blob()
          const formData = new FormData()
          formData.append('param', rsaUtil.encryption())
          formData.append('file', file)
          this.$http.post('/jiangoaoffice/Office/work/UploadContentPicFile.php', formData, {
            baseURL: 'http://www.unifiedplatform.guolianrobot.com/',
            headers: { 'Content-Type': 'multipart/form-data' }
          }).then(res => {
            success(res.data.rows.picAddr)
          }).catch(() => {
            failure('上传失败')
          })
        }
      }
    }
  },
  watch: {
    content: {
      handler() {
        this.myContent = this.content
      },
      immediate: true
    },
    myContent: {
      handler() {
        this.$emit('update:content', this.myContent)
      }
    }
  },
  activated() {
    this.tinymceEditorKey++
  }
}
</script>

<style scoped>

</style>
