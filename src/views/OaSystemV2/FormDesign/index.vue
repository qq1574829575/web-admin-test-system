<template>
  <div style="width:60%;margin: 0 auto">
    <el-button type="primary" style="margin-bottom: 10px;" @click="showPreviewDialog = true">预览</el-button>
    <vue-tinymce
      v-model="content"
      :setting="setting"
    />
    <el-dialog
      :visible.sync="showPreviewDialog"
    >
      <div>
        <el-button type="primary" @click="insertImg">插入印章</el-button>
        <!--<img class="imgItem" :src="imgUrl" draggable="true" width="40" height="40" alt="" @mousedown="move">-->
      </div>
      <el-divider />
      <div ref="content" style="width:50%;margin: 0 auto" v-html="content" />
      <el-button type="primary" style="margin-top: 10px;" @click="save">保存</el-button>
      <!--<img id="dragImg" draggable="true" style="position: absolute;z-index:999;top:10px; left:10px;" :src="imgUrl" width="100" height="100" alt="">-->
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      positionX: 0,
      positionY: 0,
      showPreviewDialog: false,
      imgUrl: 'https://iknow-pic.cdn.bcebos.com/d01373f082025aaf8fb8f5fffcedab64034f1a7f?x-bce-process%3Dimage%2Fresize%2Cm_lfit%2Cw_600%2Ch_800%2Climit_1%2Fquality%2Cq_85%2Fformat%2Cf_jpg',
      img: '',
      content: '',
      setting: {
        menubar: true,
        forced_root_block: '',
        valid_elements: '*[*]',
        toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \\\n' +
          '    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \\\n' +
          '    table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar: 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize formatpainter axupimgs',
        language: 'zh_CN', // 本地化设置
        height: 650, // 编辑器高度
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
      }
    }
  },
  methods: {
    insertImg() {
      const img = document.createElement('img')
      img.style.left = '10px' // 指定创建的DIV在文档中距离左侧的位置
      img.style.top = '10px' // 指定创建的DIV在文档中距离顶部的位置
      img.style.border = '1px solid #FF0000' // 设置边框
      img.style.position = 'absolute' // 为新创建的DIV指定绝对定位
      img.style.width = '100px' // 指定宽度
      img.style.height = '100px' // 指定高度
      img.onmousedown = this.move
      img.src = this.imgUrl
      // const div = document.createElement('div')
      // div.style.left = '10px' // 指定创建的DIV在文档中距离左侧的位置
      // div.style.top = '10px' // 指定创建的DIV在文档中距离顶部的位置
      // div.style.border = '1px solid #FF0000' // 设置边框
      // div.style.position = 'absolute' // 为新创建的DIV指定绝对定位
      // div.style.width = '100px' // 指定宽度
      // div.style.height = '100px' // 指定高度
      // div.onmousedown = this.move
      // div.appendChild(img)
      this.$refs.content.appendChild(img)
    },
    move(e) {
      const odiv = e.target // 获取目标元素

      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX
        const top = e.clientY - disY

        // 绑定元素位置到positionX和positionY上面
        // this.positionX = top
        // this.positionY = left

        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    save() {
      console.log(this.$refs.content.innerHTML)
      this.content = this.$refs.content.innerHTML
      // this.$emit('onSave', this.$refs.content.innerHTML)
    }
  }
}
</script>

<style lang="scss">
.imgItem{
  position: absolute;
  transition: all .3s;
  cursor: pointer;
  border: 1px solid black;
  &:hover{
    background: #efefef;
  }
}
</style>
