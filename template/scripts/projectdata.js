// Publish project specific data
(function() {
rh = window.rh;
model = rh.model;

rh.consts('DEFAULT_TOPIC', encodeURI("First_Topic.htm"));
rh.consts('HOME_FILEPATH', encodeURI('index.htm'));
rh.consts('START_FILEPATH', encodeURI('index.htm'));
rh.consts('HELP_ID', 'b57c19c2-fa65-4cb3-9adf-e43f04f4c171' || 'preview');
rh.consts('LNG_SUBSTR_SEARCH', 0);

model.publish(rh.consts('KEY_LNG_NAME'), "en_US");
model.publish(rh.consts('KEY_LNG'), {"Contents":"目录","Index":"索引","Search":"搜索","Glossary":"术语表","Logo/Author":"提供方:","Show":"显示","Hide":"隐藏","SyncToc":"同步目录","Prev":"<<","Next":">>","Disabled Prev":"<<","Disabled Next":">>","Seperate":"|","OpenLinkInNewTab":"在新选项卡中打开","ContentCategoryList":"选择内容类别","Cancel":"取消","CantOpenURLorFile":"无法打开 URL 或文件","CompletingContents":"正在完成目录...","Display":"显示","Term":"术语:","Definition":"定义:","Done":"完成","Find":"查找","IndexInputPrompt":"键入要查找的关键字:","RelateTopicListPrompt":"单击某一主题，然后单击“显示”。","LoadingData":"正在载入数据，请稍候...","LoadingContents":"正在载入内容，请稍候...","LoadingContentsData":"正在载入，单击此处可取消...","LoadingFTS":"正在读取搜索数据...","LoadingIndex":"正在载入索引...","LoadingTOCItem":"正在载入目录:","Searching":"正在搜索...","FtsInputPrompt":"键入要搜索的词:","FtsHilitePrompt":"突出显示搜索结果","FtsMaxResult":"每页的搜索结果","TopicsFound":"已找到主题","BrowserLimitedMessage":"您使用的浏览器不支持框架。建议将浏览器更新为支持框架的版本。","SuggestViewNoFrameMessage":"要不使用框架查看帮助系统请单击此","SuggestViewNoFrameMsg2":"超链接。","TopicsNotFound":"未找到主题。","CantSearch":"无法搜索该短语。","JS_alert_appletNotLoad":"无法载入 Applet。如果您使用的是旧版本的 Netscape，则需要对 prefs.js 文件进行编辑。","JS_alert_colorlimitation":"WebHelp 检测到您的显示设置为 16 色。为完全支持 WebHelp，请将显示设置为 256 色或更高。","Blank_topic_text":"此主题由 WinHelp Project Conversion 向导创建，并且是缺失主题或无效超链接的目标。","JS_alert_ProjectLoadingFail":"无法正确载入，请单击“刷新”。","JS_alert_cantLoadProject":"无法载入项目:","JS_alert_ErrorInLoading":"载入导航组件时发生错误。请重新生成 WebHelp。","JS_alert_LoadXmlFailed":"错误: 未能加载 xml 文件。","JS_alert_InitDatabaseFailed":"错误: 未能初始化数据库。","JS_alert_NotAllDatabaseInited":"警告: 未加载所有数据库。某些主题将会找不到。","JS_alert_InvalidExpression_1":"键入的表达式无效。","JS_alert_InvalidExpression_2":"单击","JS_alert_InvalidExpression_3":"帮助","JS_alert_InvalidExpression_4":"要了解如何使用查询表达式。（待完成）","Title":"标题","Rank":"等级","Canceled":"已取消","IndexBtnText":"搜索","FtsBtnText":"搜索","ToolBarSearchBtnText":"搜索","InTopicSearchBtnText":"搜索","SearchLabel":"搜索","SearchPrompt":"- 搜索 -","PreTooltip":"上一主题","NextTooltip":"下一主题","WebSearch":"网页搜索","SyncTocTooltip":"同步目录","Book":"书籍","Page":"页","Remote_Page":"远程页","Show_Navigation_Component":"显示导航组件","Hide_Navigation_Component":"隐藏导航组件","nls_edit_label":"键入问题:","nls_button_go_hint":"开始搜索","nls_button_go_text":"搜索","nls_body_instruction":"在上面的文本框中输入问题，然后单击“搜索”。","nls_body_empty":"很抱歉，无法找到适合您问题的答案。","IndexSelectTopicTitle":"选择主题","IndexSelectTopicLabel":"选择一个主题，然后单击“显示”","IndexSelectTopicError":"请选择一个主题。","IndexAlphabetBookmarks":"ABCDEFGHIJKLMNOPQRSTUVWXYZ","MergeError1":"所合并的帮助系统","MergeError2":"与主帮助系统使用的语言不同，这将会导致所合并帮助系统中的索引和全文搜索功能无效。","PoweredBy":"提供方:","GeneratedBy":"生成方:","Author":"作者","About":"关于","Print":"打印","TotalNumberOfSearchResults":"搜索结果总数： %1","EnableAndSearchString":"显示包含所有搜索字的结果"});

model.publish(rh.consts('KEY_HEADER_DEFAULT_TITLE_COLOR'), "#ffffff");
model.publish(rh.consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR'), "#025172");
model.publish(rh.consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY'), "\"Trebuchet MS\", Arial, sans-serif");

model.publish(rh.consts('KEY_HEADER_TITLE'), "LwDITA 技术文章            @fatshrimp707");
model.publish(rh.consts('KEY_HEADER_TITLE_COLOR'), "");
model.publish(rh.consts('KEY_HEADER_BACKGROUND_COLOR'), "");
model.publish(rh.consts('KEY_HEADER_LOGO_PATH'), "");
model.publish(rh.consts('KEY_LAYOUT_FONT_FAMILY'), "");
model.publish(rh.consts('KEY_HEADER_HTML'), "<div class='topic-header'>\
  <div class='logo' onClick='rh._.redirectToLayout()'>\
    <img src='#{logo}' />\
  </div>\
  <div class='nav'>\
    <div class='title' title='#{title}'>\
      <span onClick='rh._.redirectToLayout()'>#{title}</span>\
    </div>\
    <div class='gotohome' title='#{tooltip}' onClick='rh._.redirectToLayout()'>\
      <span>#{label}</span>\
    </div></div>\
  </div>\
<div class='topic-header-shadow'></div>\
");
model.publish(rh.consts('KEY_HEADER_CSS'), ".topic-header { background-color: #{background-color}; color: #{color}; width: calc(100%); height: 3em; position: fixed; left: 0; top: 0; font-family: #{font-family}; display: table; box-sizing: border-box; }\
.topic-header-shadow { height: 3em; width: 100%; }\
.logo { cursor: pointer; padding: 0.2em; height: calc(100% - 0.4em); text-align: center; display: table-cell; vertical-align: middle; }\
.logo img { max-height: 100%; display: block; }\
.nav { width: 100%; display: table-cell; }\
.title { width: 40%; height: 100%; float: left; line-height: 3em; cursor: pointer; }\
.gotohome { width: 60%; float: left; text-align: right; height: 100%; line-height: 3em; cursor: pointer; }\
.title span, .gotohome span { padding: 0em 1em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: block; }");

})();
