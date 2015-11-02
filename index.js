/*
 * fis cf - Cross Fire, Extreme Challenge.
 */

'use strict';

var fis = module.exports = require('fis3');
fis.require.prefixes.unshift('cf');
fis.cli.name = 'cf';

//package.json
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

// 覆盖fis kernel 的 release api
// fis.release = require('./lib/release.js');


fis.match('*.scss', {
	rExt: '.css',
	parser: fis.plugin('node-sass', {
		// outputStyle: 'expanded',
		// sourceMapContents: true,
		// sourceMap: false,
		// omitSourceMapUrl: false
	});
});

// fis-parser-less
fis.match('*.less', {
	parser: fis.plugin('less'),
	rExt: '.css'
});

fis.match('*.png', {
	optimizer: fis.plugin('png-compressor', {
			type : 'pngquant'
	});
});

fis.match('**/modules/*.{php,js,css}', {
	isMod: true
});

// fis-lint-jshint
fis.match('*.js', {
		//ignored : 'static/libs/**.js',
		ignored : [ '**/lib/**.js', '**/node_modules/**' ],

		//using Chinese reporter
		i18n : 'zh-CN',

		//jshint options
		camelcase : true,
		curly : true,
		eqeqeq : true,
		forin : true,
		immed : true,
		latedef : true,
		newcap : true,
		noarg : true,
		noempty : true,
		node : true
});

// 资源定位插件fis3-postprocessor-extras_uri
fis.match('*.html', {
	postprocessor: fis.plugin('extras_uri')
});

// Optimize
fis.media('prod')
	.match('*.js', {
		optimizer: fis.plugin('uglify-js', {
			compress : {
				drop_console: true,
				if_return: true,
				warnings: true,
				loops: true,
				sequences: true
			},
			mangle: {
				except: 'exports, module, require, define'
			}
		});
	})
	.match('*.{css,less}', {
		optimizer: fis.plugin('clean-css', {
			keepBreaks: true,
			keepSpecialComments: 1,
		});
	});


// 启用 fis-spriter-csssprites 插件
fis.media('prod')
	.match('::package', {
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites', {
      layout: 'matrix',
      margin: '15'
    });
  })
	// 对 CSS 进行图片合并
	.match('*.css', {
		htmlUseSprite: true,
		// 给匹配到的文件分配属性 `useSprite`
		useSprite: true
	});


//fis3-hook-module
fis.hook('module', {
	mode: 'amd' // 模块化支持 amd 规范，适应 require.js
});
fis.config.merge({
		modules : {
				//fis插件配置
				postprocessor: {
						js: 'amd',
						html: 'amd' // 如果你的项目中也有一些 html 文件需要使用 AMD
				}
		},

		settings : {
				optimizer : {
						'png-compressor' : {
								type : 'pngquant' //fis-optimizer-png-compressor, default is pngcrush
						}
				}
		},

		// symbol 作为文本文件编译
		project : {
				fileType : {
						text : 'symbol'
				}
		}
});
// fis-optimizer-shutup
// fis.config.set('modules.optimizer.js', 'shutup, uglify-js');



// 排除sass框架文件
fis.config.set('project.exclude', '**/_*.scss');

// fis-postpackager-autoload
fis.config.set('modules.postpackager', 'autoload');
// 添加combine插件，自动应用pack配置，打包零散资源
//fis.config.set('modules.postpackager', 'autoload, simple');
// useSiteMap设置使用整站/页面异步资源表配置，默认为false
fis.config.set('settings.postpackager.autoload.useSiteMap', true);
// useInlineMap设置内联resourceMap还是异步加载resourceMap，默认为false
fis.config.set('settings.postpackager.autoload.useInlineMap', true);
//通过include属性将额外的资源增加入resourceMap中
// fis.config.set('settings.postpackager.autoload.include', /^\/somepath\//i);
// 设置占位符
// fis.config.set('settings.postpackager.autoload.scriptTag', '<!--SCRIPT_PLACEHOLDER-->');
// fis.config.set('settings.postpackager.autoload.styleTag', '<!--STYLE_PLACEHOLDER-->');
// fis.config.set('settings.postpackager.autoload.resourceMapTag', '<!--RESOURCEMAP_PLACEHOLDER-->');
// 开启AMD模式
fis.config.set('settings.postpackager.autoload.type', 'requirejs');
// 美化resourceMap，即使开启压缩，也不会压缩resourceMap
fis.config.set('settings.postpackager.autoload.beautyResourceMap', true);

