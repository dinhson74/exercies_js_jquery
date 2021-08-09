function selectItem() {
  const selectItem = document.getElementById('items-province');
  const list_provice = document.getElementById('list-province');
  let optionItem = selectItem.options[selectItem.selectedIndex].value;
  for (let i = 0; i < list_provice.options.length; i++) {
		if (optionItem == i + 1) {
			list_provice.options[i].style.color = "#ffffff";
			list_provice.options[i].style.background = "#303030";
		} else {
			list_provice[i].style.color = "#000000";
			list_provice[i].style.background = "#ffffff";
		}
  }
  if (optionItem == 7) {
    for (let i = 0; i < list_provice.options.length; i++) {
      if(i %2 != 0){
      list_provice.options[i].style.color = "#ffffff";
			list_provice.options[i].style.background = "#303030";
      }
    }
  }
  if (optionItem == 8) {
    for (let i = 0; i < list_provice.options.length; i++) {
      if(i %2 == 0){
      list_provice.options[i].style.color = "#ffffff";
			list_provice.options[i].style.background = "#303030";
      }
    }
  }
}
