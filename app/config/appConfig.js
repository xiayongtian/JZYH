/**
 * 应用环境配置
 */
export const appEnv = {
  /**
   * 开发环境
   */
  DEV: 'DEV',
  /**
   * UAT 环境
   */
  UAT: 'UAT',
  /**
   * 生产环境
   */
  PRODUCT: 'PRODUCT',
};

export const appConfig = {
  /**
   * 是否验证登录接口
   */
  ENABLE_VALIDATE_LOGIN: false,
  /**
   * 环境类型
   */
  // 默认配置为开发环境，打包前需确认
  ENV: appEnv.DEV,
  // UAT 环境配置
  // ENV: appEnv.UAT,
  // 生产环境配置
  // ENV: AppEnv.PRODUCT,

  // 是否开启日志统计：true 为开启；false 为关闭
  ENABLE_LOG_STAT: true,
};
