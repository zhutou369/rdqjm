module.exports = function (eleventyConfig) {
  // 1. 强制拷贝静态资源（保证你站群的样式和公共图片不丢失）
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images.txt");

  // 2. 核心修复：注册 blog 文章集合，并增加极致的时区与未来发布容错
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").filter((item) => {
      // 如果文章没有写日期，直接放行
      if (!item.date) return true;
      
      // 获取当前时间的本地时间戳
      const now = new Date();
      
      // 🌟 时区安全锁：即使 Gemini 生成的 UTC 日期跨天变成了“明天”
      // 只要该文章日期不比当前时间晚 24 小时以上，就强制判定为“已发布”，绝不让它在前台失踪！
      return item.date.getTime() <= now.getTime() + 24 * 60 * 60 * 1000;
    });
  });

  // 3. 注册标准的时间格式化过滤器（用于列表页和详情页优雅显示 yyyy-mm-dd）
  eleventyConfig.addFilter("dateFilter", function (dateValue) {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // 4. 配置输入输出目录
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
  };
};