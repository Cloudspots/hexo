var spawn = require('child_process').spawn;

hexo.on('new', function(data) {
    // 使用 stdio: 'inherit' 让 vim 直接接管终端
    // 这样 vim 会正常显示，并且 hexo 进程会等待 vim 编辑完成后再退出
    var child = spawn('vim', [data.path], { 
        stdio: 'inherit',
        // 如果想在后台运行（hexo 立即退出），可以改用下面注释掉的方式
        // detached: true,
        // stdio: 'ignore'
    });
    
    // 如果后台运行，需要 unref()，但前台运行则不需要
    // 如果使用前台模式，不用 unref()

    // 捕获错误，防止因为找不到 vim 命令而卡死
    child.on('error', function(err) {
        console.error('无法启动 vim，请检查是否安装了 vim 或设置正确的路径。');
        console.error(err.message);
        // 退出进程或继续执行
        process.exit(1);
    });
});
