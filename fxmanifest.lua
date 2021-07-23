fx_version 'bodacious'
game 'gta5'

author 'ShahZaM'
version 'release'

ui_page('html/index.html')

files {
  'html/*.html',
  'html/js/*.js',
  'html/css/*.css',
}

shared_scripts { '@es_extended/locale.lua', 'config.lua', '@es_extended/imports.lua' }

client_scripts { 'client/*.lua' }
server_scripts { '@mysql-async/lib/MySQL.lua', 'server/*.lua' }