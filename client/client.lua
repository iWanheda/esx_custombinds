local playerBinds = { }

Citizen.CreateThread(function()
  if Config.Event then
    while ESX == nil do
      TriggerEvent("esx:getSharedObject", function(lib) ESX = lib end)
    end
  end
end)

local Keys = {
  ["ESC"] = 322, ["F1"] = 288, ["F2"] = 289, ["F3"] = 170, ["F5"] = 166, ["F6"] = 167, ["F7"] = 168, ["F8"] = 169, ["F9"] = 56, ["F10"] = 57,
  ["~"] = 243, ["1"] = 157, ["2"] = 158, ["3"] = 160, ["4"] = 164, ["5"] = 165, ["6"] = 159, ["7"] = 161, ["8"] = 162, ["9"] = 163, ["-"] = 84, ["="] = 83, ["BACKSPACE"] = 177,
  ["TAB"] = 37, ["Q"] = 44, ["W"] = 32, ["E"] = 38, ["R"] = 45, ["T"] = 245, ["Y"] = 246, ["U"] = 303, ["P"] = 199, ["["] = 39, ["]"] = 40, ["ENTER"] = 18,
  ["CAPS"] = 137, ["A"] = 34, ["S"] = 8, ["D"] = 9, ["F"] = 23, ["G"] = 47, ["H"] = 74, ["K"] = 311, ["L"] = 182,
  ["LEFTSHIFT"] = 21, ["Z"] = 20, ["X"] = 73, ["C"] = 26, ["V"] = 0, ["B"] = 29, ["N"] = 249, ["M"] = 244, [","] = 82, ["."] = 81,
  ["LEFTCTRL"] = 36, ["LEFTALT"] = 19, ["SPACE"] = 22, ["RIGHTCTRL"] = 70,
  ["HOME"] = 213, ["PAGEUP"] = 10, ["PAGEDOWN"] = 11, ["DELETE"] = 178,
  ["LEFT"] = 174, ["RIGHT"] = 175, ["TOP"] = 27, ["DOWN"] = 173,
  ["NENTER"] = 201, ["N4"] = 108, ["N5"] = 60, ["N6"] = 107, ["N+"] = 96, ["N-"] = 97, ["N7"] = 117, ["N8"] = 61, ["N9"] = 118
}

UpdateBinds = function()
  ESX.TriggerServerCallback("__binds:internal:_get_binds", function(data) 
    playerBinds = data
  end, {})
end

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function(playerData)
  UpdateBinds()
end)

Citizen.CreateThread(function()
  while true do
    Citizen.Wait(4)

    if IsControlJustReleased(0, Keys[Config.Key]) then
      TriggerScreenblurFadeIn(300)

      SetNuiFocus(true, true)
      SendNuiMessage(
        json.encode(
          {
            type = "showUiBinds",
            currentBinds = playerBinds
          }
        )
      )
    end
  end
end)

Citizen.CreateThread(function()
  local waitTime = 1000

  while true do
    Citizen.Wait(waitTime)

    if #playerBinds > 0 then
      waitTime = 4

      for k, v in pairs(playerBinds) do
        if IsControlJustReleased(0, Keys[v[1]]) then
          ExecuteCommand(v[2])
        end
      end
    end
  end
end)

RegisterNUICallback("close", function()
  SetNuiFocus(false, false)
  TriggerScreenblurFadeOut(300)
end)

RegisterNUICallback("save", function(data)
  if data.bindsList ~= nil and #data.bindsList > 0 then
    ESX.TriggerServerCallback("__binds:internal:_save_binds", function()
      UpdateBinds()
    end, data.bindsList)
  end
end)