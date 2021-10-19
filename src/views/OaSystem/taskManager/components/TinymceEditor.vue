<template>
  <div>
    <vue-tinymce id="tinymceEditor" key="tinymceEditorKey" v-model="myContent" :setting="setting" />
  </div>
</template>

<script>
export default {
  name: 'TinymceEditor',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myContent: this.content,
      tinymceEditorKey: 1,
      setting: {
        menubar: true,
        forced_root_block: '',
        valid_elements: '*[*]',
        toolbar:
          'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \\\n' +
          '    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \\\n' +
          '    table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar:
          'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins:
          'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize formatpainter axupimgs',
        language: 'zh_CN', // 本地化设置
        height: 650, // 编辑器高度
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
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
