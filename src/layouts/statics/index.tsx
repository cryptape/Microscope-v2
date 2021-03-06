import React from 'react'
import './index.styl'
import Content from '../../components/content'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

class Statics extends React.Component<any, any> {
  timer: any
  constructor(props: any) {
    super(props)
    this.state = {
      showProposals: false
    }
  }
  componentWillMount() {
    var self = this
    self.props.blockAction.topBlocks()
    self.props.transactionAction.topTransactions()
    self.props.staticsAction.staticsProposals(true).then((result: boolean) => {
      if (result) {
        self.setState({
          showProposals: true
        })
      }
    })
  }
  componentDidMount() {
    var self = this

    // currently no websocket
    self.timer = setInterval(() => {
      if (self.props.block.latest) {
        var nextBlockId = null
        try {
          nextBlockId = parseInt(self.props.block.latest.header.number) + 1
        } catch (e) {}
        self.props.blockAction.updateNextBlock(nextBlockId)
      } else {
        self.props.blockAction.updateNextBlock(null)
      }
      self.props.staticsAction.staticsProposals()
    }, 3000)
  }
  componentWillUnmount() {
    var self = this
    clearInterval(self.timer)
  }
  render() {
    var self = this
    var intl = self.props.intl
    var blocks = self.props.block.topList || []
    var transactions = self.props.transaction.topList || []

    var blockHeightsArray = blocks.map((block: any) => {
      return parseInt(block.header.number)
    })
    var blockTransactionCountArray = blocks.map((block: any) => {
      return (
        (block.body &&
          block.body.transactions &&
          block.body.transactions.length) ||
        0
      )
    })
    var blockQuotoUsedArray = blocks.map((block: any) => {
      return block.header.quotaUsed || 0
    })
    var transactionHashArray = transactions.map((transaction: any) => {
      return transaction.hash
    })
    var transactionQuotoUsedArray = transactions.map((transaction: any) => {
      return parseInt(transaction.gasUsed) || 0
    })

    var blockDurationArray = []
    for (var i = 0; i < blocks.length; i++) {
      if (i == 0) {
        blockDurationArray[i] = 3000
      } else {
        blockDurationArray[i] =
          blocks[i - 1].header.timestamp - blocks[i].header.timestamp
      }
    }
    blockHeightsArray.reverse()
    blockDurationArray.reverse()
    blockTransactionCountArray.reverse()
    transactionHashArray.reverse()
    transactionQuotoUsedArray.reverse()
    blockQuotoUsedArray.reverse()

    var proposals = self.props.statics.proposals || []
    var proposalsArray = proposals.map((p: any) => {
      return { value: p.count, name: p.validator }
    })

    return (
      <Content className="statics" bgColor="white">
        <div
          style={{
            width: '100%',
            backgroundImage: 'url("./images/list_bg.png")',
            backgroundRepeat: 'no-repeat',
            paddingTop: 75,
            paddingBottom: 98
          }}
        >
          <div
            className="container staticsBody"
            style={{ minHeight: 690, paddingTop: 47 }}
          >
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <ReactEchartsCore
                  echarts={echarts}
                  option={{
                    title: {
                      text: intl.formatMessage({
                        id: 'app.pages.static.interval'
                      })
                    },
                    tooltip: {},
                    color: ['#415dfc'],
                    xAxis: {
                      data: blockHeightsArray
                    },
                    yAxis: {},
                    series: [
                      {
                        type: 'bar',
                        data: blockDurationArray
                      }
                    ]
                  }}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  className="react_for_echarts"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <ReactEchartsCore
                  echarts={echarts}
                  option={{
                    title: {
                      text: intl.formatMessage({
                        id: 'app.pages.static.txcount'
                      })
                    },
                    tooltip: {},
                    color: ['#fca441'],
                    xAxis: {
                      data: blockHeightsArray
                    },
                    yAxis: {},
                    series: [
                      {
                        type: 'bar',
                        data: blockTransactionCountArray
                      }
                    ]
                  }}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  className="react_for_echarts"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <ReactEchartsCore
                  echarts={echarts}
                  option={{
                    title: {
                      text: intl.formatMessage({
                        id: 'app.pages.static.quotainblock'
                      })
                    },
                    tooltip: {},
                    color: ['#4db7f8'],
                    xAxis: {
                      data: blockHeightsArray
                    },
                    yAxis: {},
                    series: [
                      {
                        type: 'bar',
                        data: blockQuotoUsedArray
                      }
                    ]
                  }}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  className="react_for_echarts"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <ReactEchartsCore
                  echarts={echarts}
                  option={{
                    title: {
                      text: intl.formatMessage({
                        id: 'app.pages.static.quotaintx'
                      })
                    },
                    tooltip: {
                      trigger: 'item',
                      formatter: '<div>{b}</div> {c} '
                    },
                    color: ['#ab62f1'],
                    xAxis: {
                      data: transactionHashArray,
                      axisLabel: {
                        show: false
                      }
                    },
                    yAxis: {},
                    series: [
                      {
                        type: 'bar',
                        data: transactionQuotoUsedArray
                      }
                    ]
                  }}
                  style={{ height: '400px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  className="react_for_echarts"
                />
              </div>
              {self.state.showProposals ? (
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <ReactEchartsCore
                    echarts={echarts}
                    option={{
                      title: {
                        text: intl.formatMessage({
                          id: 'app.pages.static.distribution'
                        })
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: '{a}<br/><div>{b}</div> {c} ({d}%)'
                      },
                      calculable: true,
                      series: [
                        {
                          name: 'Proposal',
                          type: 'pie',
                          color: ['#415dfc', '#ab62f1', '#fca441', '#4db7f8'],
                          radius: ['50%', '70%'],
                          itemStyle: {
                            normal: {
                              label: {
                                show: false
                              },
                              labelLine: {
                                show: false
                              }
                            },
                            emphasis: {
                              label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                  fontSize: '10',
                                  fontWeight: 'bold'
                                }
                              }
                            }
                          },
                          data: proposalsArray
                        }
                      ]
                    }}
                    style={{ height: '400px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                    className="react_for_echarts"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Content>
    )
  }
}
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appAction from '../../redux/actions/appAction'
import * as staticsAction from '../../redux/actions/statics'
import * as blockAction from '../../redux/actions/block'
import * as transactionAction from '../../redux/actions/transaction'
import { IRootState } from '../../redux/states'

export default connect(
  (state: IRootState) => ({
    app: state.app,
    block: state.block,
    transaction: state.transaction,
    statics: state.statics
  }),
  dispatch => ({
    appAction: bindActionCreators(appAction, dispatch),
    staticsAction: bindActionCreators(staticsAction, dispatch),
    blockAction: bindActionCreators(blockAction, dispatch),
    transactionAction: bindActionCreators(transactionAction, dispatch)
  })
)(injectIntl(Statics))
