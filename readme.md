# Codebit Modal (codebit-modal)

## HTML Struct

```
<div class="cb-modal-backdrop" style='display: none'>
    <div>
        <div>
            <div class="cb-modal"> 
                <div class="cb-modal-head">
                </div>    
                <div class="cb-modal-body">
                </div>    
                <div class="cb-modal-foot">
                </div>    
            </div>    
        </div>
    </div>
</div>
```

## Javascript

### Examples

Show modal:
```
    var modalElement = document.getElementsByClassName("cb-modal-backdrop")[0];
    var myModal = new CbModal(modalElement);
    myModal.show();
```

Hide modal:
```
    myModal.hide();
```

### Documentation