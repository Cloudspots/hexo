var spawn = require('child_process').spawn;

hexo.on('new', function(data) {
    spawn('subl', [data.path], { stdio: 'inherit' });
});
