module.exports = {
  apps : [{
    name      : 'API',
    script    : 'app.js',
    env: {
      NODE_ENV: 'development'
    },
    env_development : {
      NODE_ENV: 'development'
    }
  }],

  deploy : {
    development : {
      key  : 'beu.pem',
      user : 'ec2-user',
      host : '13.126.45.78',
      ref  : 'origin/testing',
      // repo : 'git@gitlab.com:dhinchekDashboard/version1.git',
      repo : 'git@gitlab.com:nikitaChauhan/dhinchekDashboard/version1.git',
      path : 'var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development'
    }
  }
};

