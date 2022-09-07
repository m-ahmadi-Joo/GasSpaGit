import { FormControl } from "@angular/forms";

export function requiredFileType(type: string) {
  var types: string[];
  types = type.split(",");
  console.log(types);
  return function(control: FormControl) {
    const file = control.value;
    var fileLenght = file.length;
    var response: number = 0;

    if (file) {
      for (let index = 0; index < file.length; index++) {
        const extension = file[index].name.slice(
          (Math.max(0, file[index].name.lastIndexOf(".")) || Infinity) + 1);
        // if (types[index].toLowerCase() !== extension.toLowerCase())
        if (!types.includes(extension.toLowerCase())) {
          return {
            requiredFileType: true
          };
        }
        ++response;
      }
      if (response == fileLenght) {
        return null;
      } else {
        return {
          requiredFileType: true
        };
      }
    }

    return null;
  };
}

export function requiredFileSize(size: string) {
  return function(control: FormControl) {
    const file = control.value;
    if (file) {
      for (let index = 0; index < file.length; index++) {
        const fileSize = file[index].size;
        if (fileSize > size) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }
    }

    return null;
  };
}
