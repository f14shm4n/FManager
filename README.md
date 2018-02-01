# FManager

It's file manager\selector for web. 

Project written on Typescript, with SASS for styles.

## Requirements

The following packages are required.

| Package | Version | Description |
|---------|---------|-------------|
| [jquery](https://jquery.com/) | 1.9+ | Add the script to the page. |
| [f14-l10n](https://github.com/f14shm4n/f14.l10n-ts) | 1.0.0+ | Add the script to the page. You do not need to configure anything. |

### Installing

All you need in in the `dist` folder.

* CSS
* Fonts
* JS

You can see an example of use in the `index.html`. Copy `dist` folder to the folder with name `fmanager`. This name will be used in the samples.

Add all necessary packages:

```
    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/f14-l10n/dist/js/app.min.js"></script>
```

Add package scripts and styles:

```
    <link rel="stylesheet" href="~/lib/fmanager/dist/css/styles.min.css" asp-append-version="true" />
    <script src="~/lib/fmanager/dist/js/app.min.js" asp-append-version="true"></script>
```

### Usage

Add initialization script:

```
<script type="text/javascript">
        // Create file manager settings.
        var settings = {
            rootFolder: '/sample/root/folder', // Relative or absolute path to the root folder.
            selectCallback: function (files) { }, // Set callback function for file selecting. This empty function is default behavior of file selection.           
            // Sets end points urls.
            endPointUrlMap: {
                folder_struct: 'action/folder/struct', // The route to the backend api for getting folder structure.
                rename: 'action/rename', // The route to the backend api for rename object.
                delete: 'action/delete', // The route to the backend api for delete object.
                move: 'action/move', // The route to the backend api for move object.
                copy: 'action/copy', // The route to the backend api for copy object.
                create_folder: 'action/create/folder', // The route to the backend api for create folder.
                upload_file: 'action/upload/file' // The route to the backend api for upload files.
            }
        };
        // Start file manager.
        new FManager(settings);
    </script>
```

### Usage as window

If you using file manager as file selector, without any specified `selectorCallback` you should use `window.selectedFiles` property to retrieve selected files.

**Example:**

Sample.html - the page that open file manage window

```
  // Open window
  var fileBrowser = window.open('/file-manager', 'File manager', `height=400, width=400, top=0, left=0`);
  // Setup beforeunload event.
  fileBrowser.onbeforeunload = function (e) {
      var fileList = window.selectedFiles; // Get your selected files.
      ... do some stuff ...
  };
```

### Configuration

| Key | Type | Require | Description |
|-----|------|---------|-------------|
| rootFolder | string | Yes | The relative or absolute path to the root folder. This is initial folder. |
| xhrBeforeSend | function (XMLHttpRequest) | No | The function by which you can pre-configure the Ajax request. |
| selectCallback | function (string[]) | No (Has a default value.) | The callback function for file selecting. |
| actionButtons | ActionButtonInfo[] | No | The array with custom action buttons. |
| allowShortcuts | boolean | No | Allow or not to use shortcust. [Not implemented yet.] |
| uploadFileFilter | string | No | The upload files filter. [See](https://www.w3schools.com/tags/att_input_accept.asp) |
| L10NProvider | IL10NProvider | No (Has a default value.) | The l10nProvider. |
| DEBUG | boolean | No | Enable or disable debug mode. |
| MOCK | boolean | No | Enable or disable mock mode. In memory actions. |
| endPointUrlMap | Yes | object as map [key: string, value: string] | The end point api urls map. [See keys](#end-point-keys) |
| ajaxRequestMap | IOperationRequest<BaseParam, BaseResult> | No (Has a default value.) | The ajax requests map. Each request is mapped to the end address. See `endPointUrlMap`. |
| inMemoryData | InMemoryNavigationMap | No (Has a default value.) | In Memory map for mock. |

### End point keys

All keys you can find in the `AjaxActionTypes` type;

```
    AjaxActionTypes {
        public static FolderStruct: string = 'folder_struct';
        public static Rename: string = 'rename';
        public static Delete: string = 'delete';
        public static Move: string = 'move';
        public static Copy: string = 'copy';
        public static CreateFolder: string = 'create_folder';
        public static UploadFile: string = "upload_file";
    }
```

### Authors

[f14shm4n](https://github.com/f14shm4n)

### License

[MIT](https://opensource.org/licenses/MIT)
