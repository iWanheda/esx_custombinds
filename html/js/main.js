let bindsList = [], isBinding = null;

Array.prototype.first = function (n) {
  return (!arguments.length ? this[0] : this.slice(0, Math.max(0, n)));
};

Array.prototype.second = function (n) {
  return (!arguments.length ? this[1] : this.slice(1, Math.max(1, n)));
};

window.addEventListener("message", (event) => {
  const { type, currentBinds } = event?.data;

  if (type === "showUiBinds") {
    $("#main").fadeIn(300);

    // If we already have binds clear bind-list and append our binds
    if (currentBinds.length > 0) {
      $("#bind-list").empty();

      bindsList = currentBinds;

      currentBinds.forEach(el => {
        const childId = $("#bind-list").children().length;

        $("#bind-list").append(
          `
          <div class="flex w-full items-center space-x-2">
            <div class="bg-gray-500 rounded-md px-2 p-1 text-gray-300">
              <span>${childId + 1}</span>
            </div>
            <div id="bkey-${childId}" class="flex justify-center w-32 bind-key hover:bg-gray-800 duration-200 cursor-pointer bg-gray-700 text-gray-400 px-2 p-1 rounded-md">
              <span>${el.first().toUpperCase()}</span>
            </div>
            <input type="text" id="bcmd-${childId}" placeholder="Command"
              class="bind-cmd w-full focus:outline-none rounded-md px-2 p-1 border bg-transparent border-gray-500 text-gray-400">
            <div id="brem-${childId}" class="bind-rem text-gray-400 pl-1">
              <i class="fas fa-times duration-200 hover:text-gray-300 cursor-pointer"></i>
            </div>
          </div>
          `
        );

        $(`#bcmd-${childId}`).val(el.second().toLowerCase())
      })
    };
  }
});

$(document).ready(() => {
  $("#add-bind").on("click", (ev) => {
    // If we're binding let's not append a new child, doesn't make sense
    if (isBinding) {
      return;
    }

    // Let's use this to dynamically append new binds with the right indexes
    const childId = $("#bind-list").children().length;

    $("#bind-list").append(
      `
    <div class="flex w-full items-center space-x-2">
      <div class="bg-gray-500 rounded-md px-2 p-1 text-gray-300">
        <span>${childId + 1}</span>
      </div>
      <div id="bkey-${childId}" class="bind-key hover:bg-gray-800 duration-200 cursor-pointer bg-gray-700 text-gray-400 flex justify-center w-32 px-2 p-1 rounded-md">
        <span>KEY</span>
      </div>
      <input type="text" id="bcmd-${childId}" placeholder="Command"
        class="bind-cmd w-full focus:outline-none rounded-md px-2 p-1 border bg-transparent border-gray-500 text-gray-400">
      <div id="brem-${childId}" class="bind-rem text-gray-400 pl-1">
        <i class="fas fa-times duration-200 hover:text-gray-300 cursor-pointer"></i>
      </div>
    </div>
    `
    );
  });

  $(document).on("click", ".bind-rem", (ev) => {
    if (isBinding) {
      return;
    }

    const element = $(`#${ev.currentTarget.id}`);
    const bindListEl = $("#bind-list");

    if (bindListEl.children().length <= 1) {
      bindListEl.append(
        `
        <div id="bind-list" class="overflow-y-auto max-h-96 flex flex-col justify-center px-6 space-y-6">
          <div class="flex w-full items-center space-x-2">
            <div class="bg-gray-500 rounded-md px-2 p-1 text-gray-300">
              <span>1</span>
            </div>
            <div id="bkey-0"
              class="hover:bg-gray-800 duration-200 bind-key cursor-pointer bg-gray-700 text-gray-400 flex justify-center w-32 px-2 p-1 rounded-md">
              <span>KEY</span>
            </div>
            <input id="bcmd-0" type="text" placeholder="Command"
              class="bind-cmd w-full focus:outline-none rounded-md px-2 p-1 border bg-transparent border-gray-500 text-gray-400">
          </div>
        </div>`
      )
    }

    element.parent().remove();
  });

  $(document).on("click", ".bind-key", (ev) => {
    if (isBinding) {
      return;
    }

    const element = $(`#${ev.currentTarget.id}`);
    element.find("span").text("...");

    isBinding = element.find("span");
  });

  $(document).keyup(({ key }) => {
    if (isBinding === null) {
      return;
    }

    if (key === "Escape") {
      isBinding.text("KEY");
      return isBinding = null;
    }

    if (key === "u") {
      return;
    }

    (() => {
      isBinding.text(key.toUpperCase());
      isBinding = null;
    })();
  });

  const closeUi = () => {
    $.post("http://esx_custombinds/close");
    $("#main").fadeOut(300);
  }

  $(document).on("click", "#close", (ev) => {
    closeUi();
  });

  $(document).on("click", "#save-binds", (ev) => {
    $("#save-loading").fadeIn(300);

    let newBindList = [];
    $("#bind-list").children().each((_) => {
      const
        key = $(`#bkey-${_}`).find('span').text(),
        value = $(`#bcmd-${_}`).val();

      if (key === null || value === null
        || key === "" || key.toLowerCase() === "key" || value === "") {
        return true;
      }

      newBindList.push([key, value]);
    });

    // Just for the cosmetics hehe
    setTimeout(() => {
      $.post("http://esx_custombinds/save", JSON.stringify({ bindsList: newBindList }))
      closeUi();
      document.getElementById("audio").play();
      $("#save-loading").fadeOut(300);
    }, 800)
  })
});