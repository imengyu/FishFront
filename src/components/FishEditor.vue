<template>
  <div :class="'fish-editor' + (fullEditor ? ' fullscreen' : '')">
    
    <div class="fish-editor-toolbar">
      <ul class="fish-editor-menu">
        <li>
          <a href="javascript:;" v-on:click="undo()" title="撤销（Ctrl+Z）" unselectable="on">
            <i class="fa fa-undo" name="undo" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="redo()" title="重做（Ctrl+Y）" unselectable="on">
            <i class="fa fa-repeat" name="redo" unselectable="on"></i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="addBold()" title="粗体" unselectable="on">
            <i class="fa fa-bold" name="bold" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addDel()" title="删除线" unselectable="on">
            <i class="fa fa-strikethrough" name="del" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addItalic()" title="斜体" unselectable="on">
            <i class="fa fa-italic" name="italic" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addQuote()" title="引用" unselectable="on">
            <i class="fa fa-quote-left" name="quote" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a
            href="javascript:;"
            v-on:click="addFirstUpperCase()"
            title="将每个单词首字母转成大写"
            unselectable="on"
          >
            <i class="fa" name="ucwords" style="font-size:20px;margin-top: -3px;">Aa</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addUpperCase()" title="将所选转换成大写" unselectable="on">
            <i class="fa fa-font" name="uppercase" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addLowerCase()" title="将所选转换成小写" unselectable="on">
            <i class="fa" name="lowercase" style="font-size:24px;margin-top: -10px;">a</i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h1')" title="标题1" unselectable="on">
            <i class="fa editormd-bold" name="h1" unselectable="on">H1</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h2')" title="标题2" unselectable="on">
            <i class="fa editormd-bold" name="h2" unselectable="on">H2</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h3')" title="标题3" unselectable="on">
            <i class="fa editormd-bold" name="h3" unselectable="on">H3</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h4')" title="标题4" unselectable="on">
            <i class="fa editormd-bold" name="h4" unselectable="on">H4</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h5')" title="标题5" unselectable="on">
            <i class="fa editormd-bold" name="h5" unselectable="on">H5</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHead('h6')" title="标题6" unselectable="on">
            <i class="fa editormd-bold" name="h6" unselectable="on">H6</i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="addUl()" title="无序列表" unselectable="on">
            <i class="fa fa-list-ul" name="list-ul" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addOl()" title="有序列表" unselectable="on">
            <i class="fa fa-list-ol" name="list-ol" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addHr()" title="横线" unselectable="on">
            <i class="fa fa-minus" name="hr" unselectable="on"></i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="addLink()" title="链接" unselectable="on">
            <i class="fa fa-link" name="link" unselectable="on"></i>
          </a>
        </li>
        <li id="image-dropdown">
          <a href="javascript:;" role="button" title="添加图片" @click="showImageDropDown(true)">
            <i class="fa fa-picture-o" name="image" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addInlineCode()" title="行内代码" unselectable="on">
            <i class="fa fa-code" name="code" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addPre()" title="预格式文本 / 代码块（缩进风格）" unselectable="on">
            <i class="fa fa-file-code-o" name="preformatted-text" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addCode()" title="代码块（多语言风格）" unselectable="on">
            <i class="fa fa-file-code-o" name="code-block" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addTable()" title="添加表格" unselectable="on">
            <i class="fa fa-table" name="table" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="addDateTime()" title="日期时间" unselectable="on">
            <i class="fa fa-clock-o" name="datetime" unselectable="on"></i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="gotoLine()" title="跳转到行" unselectable="on">
            <i class="fa fa-terminal" name="goto-line" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="switchPreview()" title="关闭实时预览" unselectable="on">
            <i
              :class="'fa ' + (preview ? 'fa-eye-slash' : 'fa-eye')"
              name="watch"
              unselectable="on"
            ></i>
          </a>
        </li>
        <li>
          <a
            href="javascript:;"
            v-on:click="fullPreview()"
            title="全窗口预览HTML（按 Shift + ESC还原）"
            unselectable="on"
          >
            <i class="fa fa-desktop" name="preview" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="full()" title="全屏（按ESC还原）" unselectable="on">
            <i class="fa fa-arrows-alt" name="fullscreen" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="clear()" title="清空" unselectable="on">
            <i class="fa fa-eraser" name="clear" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="search()" title="搜索" unselectable="on">
            <i class="fa fa-search" name="search" unselectable="on"></i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-on:click="save()" title="保存" unselectable="on">
            <i class="fa fa-floppy-o" name="info" unselectable="on"></i>
          </a>
        </li>
        <li class="divider" unselectable="on">|</li>
        <li>
          <a href="javascript:;" v-on:click="about()" title="关于 Fish Editor" unselectable="on">
            <i class="fa fa-info-circle" name="info" unselectable="on"></i>
          </a>
        </li>
        
      </ul>
    </div>
    <div class="fish-editor-area">
      <div
        :class="'fish-editor-preview-area post-container' + (fullPreviewArea ? ' fullarea': '')"
        v-if="preview"
        v-html="value"
      ></div>
      <div
        :class="'fish-editor-code-area' + (preview ? (fullPreviewArea ? ' invisible' : ''): ' fullarea')"
      >
        <textarea id="fish-editor-code-area" class="full" v-model="value"></textarea>
      </div>
    </div>
    <div v-if="imageDropdownShow" :style="'display:inline-block;position:absolute;top:40px;left:'+imageDropdownLeft+'px'" class="dropdown-menu" aria-labelledby="dropdownMenuButton" @blur="showImageDropDown(false)" @click="showImageDropDown(false)">
      <a class="dropdown-item" v-on:click="addImage()" href="javascript:;">从链接添加图片</a>
      <a class="dropdown-item" v-on:click="addImageMediaCenter()" href="javascript:;">从媒体库选择图片</a>
      <a class="dropdown-item" v-on:click="addImageUpload()" href="javascript:;">上传图片</a>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addLinkModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addLinkModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addLinkModalLabel">添加链接</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="link-address" class="col-form-label">链接地址:</label>
                <input type="text" class="form-control" id="link-address" v-model="currentAddLink">
              </div>
              <div class="form-group">
                <label for="link-text" class="col-form-label">链接标题:</label>
                <textarea class="form-control" id="link-text" v-model="currentAddText"></textarea>
              </div>
              <div class="custom-control custom-checkbox mr-sm-2">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="link-new-target"
                  checked="checked"
                >
                <label class="custom-control-label" for="link-new-target">在新标签页中打开此链接</label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addLinkFinal">确定</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="addImageModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addImageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addImageModalLabel">添加图片</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="image-address" class="col-form-label">图片地址:</label>
                <input type="text" class="form-control" id="image-address" v-model="currentAddLink">
              </div>
              <div class="form-group">
                <label for="image-text" class="col-form-label">图片标题:</label>
                <textarea class="form-control" id="image-text" v-model="currentAddText"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="addImageFinal">确定</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="gotoLineModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="gotoLineModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="gotoLineModalLabel">跳转到行</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="image-address" class="col-form-label">要转到的行号:</label>
                <input type="text" class="form-control" id="image-address" v-model="currentGoLine">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="gotoLineFinal">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import CodeMirror from 'codemirror'
import { codemirror } from "vue-codemirror";
import $ from 'jquery'

import "codemirror/addon/search/matchesonscrollbar.css";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/search/match-highlighter.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/lib/codemirror.css";

export default {
  props: {
    showed: {
      default: false
    },
    value:{
      default: ""
    },
  },
  data() {
    return {
      fullPreviewArea: false,
      preview: true,
      fullEditor: false,

      currentGoLine: "",
      currentAddText: "",
      currentAddLink: "",

      htmlEditor: null,
      
      imageDropdownShow: false,
      imageDropdownLeft: 0,

    };
  },
  components: {
    codemirror
  },
  mounted() {
    setTimeout(this.init, 1000);
  },
  watch: {
      value(to, from){
          if(this.htmlEditor.getValue() != to)
            this.htmlEditor.setValue(to);
      },
  },
  methods: {
    m() {},
    showImageDropDown(s){
      if(s){
        var image_dropdown = document.getElementById('image-dropdown');
        image_dropdown.focus();
        this.imageDropdownLeft = image_dropdown.offsetLeft;
        this.imageDropdownShow = true;
      }else this.imageDropdownShow = false;
    },
    init() {
      var main = this;
      main.htmlEditor = CodeMirror.fromTextArea(
        document.getElementById("fish-editor-code-area"),
        {
          lineNumbers: true, // 显示行数
          indentUnit: 4, // 缩进单位为4
          styleActiveLine: true, // 当前行背景高亮
          matchBrackets: true, // 括号匹配
          mode: "htmlmixed", // HMTL混合模式
          lineWrapping: true // 自动换行
        }
      );
      main.htmlEditor.setSize("100%", "100%");
      main.htmlEditor.setOption("extraKeys", {
        // Tab键换成4个空格
        Tab: function(cm) {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        }
      });
      var tick;
      main.htmlEditor.on("change", function() {
        clearTimeout(tick);
        setTimeout(function() {
          main.$emit("input", main.htmlEditor.getValue());
        }, 200);
      });
    },
    save(){
      this.$emit('save');
    },
    undo() {
      this.htmlEditor.undo();
    },
    redo() {
      this.htmlEditor.redo();
    },
    clear() {
      var main = this;
      this.$swal({
        type: "warning", // 弹框类型
        title: "清空内容", //标题
        text: "您确定要清空所有内容吗?",
        confirmButtonColor: "#d33",
        confirmButtonText: "确定",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: "取消",
        focusCancel: true,
        reverseButtons: true
      }).then(isConfirm => {
        if (isConfirm.value) {
          main.htmlEditor.setValue("");
        }
      });
    },
    full() {
      this.fullEditor = !this.fullEditor;
    },
    fullPreview() {
      this.fullPreviewArea = !this.fullPreviewArea;
    },
    switchPreview() {
      this.preview = !this.preview;
    },
    about() {
      this.$swal("About Fish Editor", "Very very simple html editor", "info");
    },
    addHead(hx) {
      this.insertOrReplace("<" + hx + ">", "</" + hx + ">", true, true, true);
    },
    addBold() {
      this.insertOrReplace("<b>", "</b>", true, true, true);
    },
    addDel() {
      this.insertOrReplace("<del>", "</deL>", true, true, true);
    },
    addItalic() {
      this.insertOrReplace("<i>", "</i>", true, true, true);
    },
    addQuote() {
      this.insertOrReplace("<blockquote>", "</blockquote>", true, true);
    },
    addFirstUpperCase() {
      this.replaceCase(true, true);
    },
    addUpperCase() {
      this.replaceCase(true);
    },
    addLowerCase() {
      this.replaceCase(false);
    },
    addLink() {
      if (this.htmlEditor.somethingSelected())
        this.currentAddText = this.htmlEditor.getSelection();
      else this.currentAddText = "";
      this.currentAddLink = "";

      $("#addLinkModal").modal("show");
    },
    addLinkFinal(){
      $("#addLinkModal").modal("hide");
        this.insertOrReplace(
          '<a href="' +
            this.currentAddLink +
            '"' +
            ($("#link-new-target").prop("checked") ? ' target="_blank"' : "") +
            ">" + (!this.htmlEditor.somethingSelected() ? this.currentAddText : ''),
          "</a>",
          true,
          true
        );
    },
    addImage() {
      if (this.htmlEditor.somethingSelected())
        this.currentAddText = this.htmlEditor.getSelection();
      else this.currentAddText = "";
      this.currentAddLink = "";
      $("#addImageModal").modal("show");
    },
    addImageFinal(){
      $("#addImageModal").modal("hide");
      this.insertOrReplace(
        '<img src="' +
          this.currentAddLink +
          '" alt="' +
          this.currentAddText +
          '" />',
        "",
        true,
        true
      );
    },
    addImageMediaCenter(){
      this.$emit('insert-image', 'select-in-media-center');
    },
    addImageUpload(){
      this.$emit('insert-image', 'upload');
    },
    addInlineCode() {
      this.insertOrReplace("<code>", "</code>", true, true);
    },
    addPre() {
      this.insertOrReplace("\n<pre>\n", "\n</pre>\n", true, true);
    },
    addCode() {
      this.insertOrReplace("\n<pre>\n  <code class=\"lanuage\">\n", "\n  </code>\n</pre>\n", true, true);
    },
    addTable() {
      this.insertOrReplace(
"\n<table class=\"table table-bordered\">\n\
  <thread>\n\
    <th>表头1</th>\n\
    <th>表头2</th>\n\
    <th>表头3</th>\n\
  </thread>\n\
  <tbody>\n\
    <tr>\n\
      <td>数据1</td>\n\
      <td>数据2</td>\n\
      <td>数据3</td>\n\
    </tr>\n\
  </tbody>\n\
</table>\n",
        "", 
        false,
        true
      );
    },
    addDateTime() {
      this.insertOrReplace(
        new Date().format("YYYY-mm-dd HH:ii:ss"),
        null,
        false,
        false
      );
    },
    addOl() {
      this.insertOrReplace("\n<ol>\n  <li>项目1</li>\n  <li>项目2</li>\n  <li>项目3</li>\n", "\n</ol>", true, true);
    },
    addUl() {
      this.insertOrReplace("\n<ul>\n  <li>项目1</li>\n  <li>项目2</li>\n  <li>项目3</li>\n", "\n</ul>", true, true);
    },
    addHr() {
      this.insertOrReplace("<hr>", null, false, true);
    },

    insertOrReplace(objStart, objEnd, canSurround, htmlTag, baseTag) {
      if (this.htmlEditor.somethingSelected()) {
        var old = this.htmlEditor.getSelection();
        if (canSurround) {
          if(baseTag) { 
            var oldText = this.alredaySurroundByBaseTag();
            old = oldText ? oldText : old
          }
          this.htmlEditor.replaceSelection(objStart + old + objEnd);
        } else this.htmlEditor.replaceSelection(objStart + old);
      } else {
        if (canSurround) this.htmlEditor.replaceSelection(objStart + objEnd);
        else this.htmlEditor.replaceSelection(objStart);
      }
    },
    alredaySurroundByBaseTag(text){
      return false
    },
    replaceCase(up, onlyFirst) {
      if (this.htmlEditor.somethingSelected()) {
        var old = this.htmlEditor.getSelection();
        if (up) {
          if (onlyFirst) {
            var newStr = old.substr(1, old.length - 1);
            newStr = old.substr(0, 1).toUpperCase() + newStr;
            this.htmlEditor.replaceSelection(newStr);
          } else this.htmlEditor.replaceSelection(old.toUpperCase());
        } else {
          if (onlyFirst) {
            var newStr = old.substr(1, old.length);
            newStr = old.substr(0, 1).toLowerCase() + newStr;
            this.htmlEditor.replaceSelection(newStr);
          } else this.htmlEditor.replaceSelection(old.toLowerCase());
        }
      }
    },

    gotoLine() {
      $("#gotoLineModal").modal("show");
    },
    gotoLineFinal(){
      $("#gotoLineModal").modal("hide");
      var line = parseInt(main.currentGoLine);
      if (line > 0) main.htmlEditor.setCursor(line);
    },
    search() {
      this.htmlEditor.execCommand("find");
    }
  }
};
</script>

