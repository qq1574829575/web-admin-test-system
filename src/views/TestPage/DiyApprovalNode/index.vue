<template>
  <div style="display: flex;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
    <div style="max-width: 80%">
      <el-scrollbar style="width: 100%" :wrap-style="[{ 'overflow-y': 'hidden'}]">
        <div class="diy-approval-node-box">
          <div v-for="(processNode,index) in processNodes" :key="index" class="diy-approval-node-box-item">
            <div class="diy-approval-node-box-item-name">
              <i class="el-icon-time" style="font-size: 20px;color: #409EFF">
                <span style="font-size: 15px">
                  节点{{ index+1 }}
                </span>
              </i>
            </div>
            <div class="diy-approval-node-box-item-line">
              <div class="diy-approval-node-box-item-line-left" />
              <div class="el-icon-time" style="margin-top: -5px;color: #409EFF" />
              <div class="diy-approval-node-box-item-line-right" />
            </div>
            <div style="padding: 20px">
              <el-card shadow="hover" style="max-width: 300px">
                <div style="margin-top: -20px;">
                  <div style="float:left;font-size: 12px;">节点审核人</div>
                  <div style="float:right;">
                    <el-tooltip effect="dark" content="添加节点审核人" placement="top">
                      <i class="el-icon-plus" style="cursor:pointer;" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除该节点" placement="top">
                      <i class="el-icon-close" style="cursor:pointer;color: red;margin-left: 5px;" />
                    </el-tooltip>
                  </div>
                </div>
                <el-table
                  :data="processNode"
                  size="mini"
                  max-height="120"
                  :show-header="false"
                >
                  <el-table-column
                    prop="reviewerName"
                    label="节点审核人"
                    min-width="120"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="reviewerName"
                    label="节点审核人"
                    min-width="120"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="reviewerName"
                    label="节点审核人"
                    min-width="120"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="reviewerName"
                    label="节点审核人"
                    min-width="120"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    fixed="right"
                    label="操作"
                    align="center"
                    width="50"
                  >
                    <template>
                      <el-tooltip effect="dark" content="删除该审核人" placement="top">
                        <i class="el-icon-close" style="color: red;font-size: 15px;cursor:pointer;" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div style="width: 20%;text-align: center;transform: translateY(45%);">
      <el-button type="primary" icon="el-icon-plus" plain>添加流程节点</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      processNodes: [
        [
          {
            nodeDeptId: '0',
            nodePosition: '分院',
            reviewerName: '分院审核'
          }
        ],
        [
          {
            nodeDeptId: '2',
            nodePosition: '教务处-处长',
            reviewerName: '教务处处长-某某某'
          },
          {
            nodeDeptId: '2',
            nodePosition: '教务处-处长',
            reviewerName: '教务处处长-某某某'
          },
          {
            nodeDeptId: '2',
            nodePosition: '教务处-处长',
            reviewerName: '教务处处长-某某某'
          },
          {
            nodeDeptId: '2',
            nodePosition: '教务处-处长',
            reviewerName: '教务处处长-某某某'
          }
        ]
      ]
    }
  }
}
</script>

<style lang="scss">
.diy-approval-node-box{
  display: flex;
  padding: 20px;
  width: 100%;
  .diy-approval-node-box-item {
    flex-shrink: 0;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    //width: 20%;
    .diy-approval-node-box-item-name{
      text-align: center;
    }
    .diy-approval-node-box-item-line{
      margin-top: 10px;
      display: flex;
      .diy-approval-node-box-item-line-left{
        height: 1px;width: 50%;background: #0a76a4;
      }
      .diy-approval-node-box-item-line-center{
        width: 12px;height: 12px;background: #00ff80;border-radius: 50%;margin-top: -6px
      }
      .diy-approval-node-box-item-line-right{
        height: 1px;width: 50%;background: #0a76a4;
      }
    }
  }
  .diy-approval-node-box-item:first-child{
    .diy-approval-node-box-item-line{
      .diy-approval-node-box-item-line-left{
        visibility: hidden;
      }
    }
  }
  .diy-approval-node-box-item:last-child{
    .diy-approval-node-box-item-line{
      .diy-approval-node-box-item-line-right{
        visibility: hidden;
      }
    }
  }
}
/*!*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*!
::-webkit-scrollbar {
  width: 7px; !*滚动条宽度*!
  height: 7px; !*滚动条高度*!
  background-color: white;
}

!*定义滑块 内阴影+圆角*!
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(221, 222, 224); !*滚动条的背景颜色*!
}*/
</style>
