ESX.RegisterServerCallback("__binds:internal:_save_binds", function(source, cb, args)
  local xPlayer = ESX.GetPlayerFromId(source)

  MySQL.Async.execute("INSERT INTO player_binds VALUES(@owner, @binds) ON DUPLICATE KEY UPDATE binds = @binds",
  {
    ["@owner"] = xPlayer.getIdentifier(),
    ["@binds"] = json.encode(args)
  }, function(res)
    cb(true)
  end)
end)

ESX.RegisterServerCallback("__binds:internal:_get_binds", function(source, cb, args)
  local xPlayer = ESX.GetPlayerFromId(source)

  MySQL.Async.fetchAll("SELECT binds FROM player_binds WHERE owner = @owner",
  {
    ["@owner"] = xPlayer.getIdentifier(),
  }, function(res)
    if res ~= nil and res[1] ~= nil then
      cb(json.decode(res[1].binds))
    end
  end)
end)