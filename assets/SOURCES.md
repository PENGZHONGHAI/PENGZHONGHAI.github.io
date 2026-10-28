# 日本都道府县边界

来源：地球地图日本（日本国土地理院 / Global Map Japan）。
转换数据：https://github.com/dataofjapan/land/blob/master/japan.geojson
说明与使用条件：https://github.com/dataofjapan/land#readme
获取日期：2026-10-27。此为该项目发布的历史边界数据，并非2026年实时测绘。

本地文件 japan-prefectures.js 包含47个都道府县，以全国地方公共团体都道府县代码01–47关联简体中文名称。保留源数据全部多边形、内环及离岛顶点；使用标准纬线37°N的等距圆柱投影，SVG坐标保留两位小数。没有手绘或以矩形代替冲绳，没有将岛屿挪位。

地图几何与到访年月分离。当前年月清单保存在 visit-months-data.js；原始旅行资料仍保存在 travel-records.js。手动补充使用单独的年月存储键 pz_visit_months:<country>:<region>，不上传、不跨设备同步；旧精确日期存储仅保留兼容，不在当前界面读取或展示。图片与视频保存在当前浏览器 IndexedDB。数据中的边界及区域表现沿用来源，不作另行改绘。

# 中国省级边界

来源：阿里云 DataV.GeoAtlas，https://datav.aliyun.com/portal/school/atlas/area_selector
原始文件：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
获取日期：2026-10-27。响应 Last-Modified 为2021-06-29，属于来源发布的历史版本，不宣称为实时边界。
china-provinces.geojson 保留原始下载内容；china-provinces.js 为本地 Web Mercator SVG 路径，包含34个具名省级地区与来源附带的南海边界要素，保留离岛，不依赖在线加载。
转换脚本：项目根目录 build-china-map.py。绿色仅表示当前旅行材料中有可对应记录，灰色不等同于确认未到访。
