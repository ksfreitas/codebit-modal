function createCbModalSkeleton() {
    var backdrop = document.createElement("div");
    backdrop.className = "cb-modal-backdrop";

    var table = document.createElement("div");
    backdrop.appendChild(table);

    var tableCell = document.createElement("div");
    table.appendChild(tableCell);

    var modal = document.createElement("div");
    modal.className = "cb-modal";
    tableCell.appendChild(modal);

    var modalHead = document.createElement("div");
    modalHead.className = "cb-modal-head";
    modal.appendChild(modalHead);

    var modalBody = document.createElement("div");
    modalBody.className = "cb-modal-body";
    modal.appendChild(modalBody);

    var modalFoot = document.createElement("div");
    modalFoot.className = "cb-modal-foot";
    modal.appendChild(modalFoot);

    return backdrop;
}

function CbModal(element) {
    this.backdrop = element || createCbModalSkeleton();
    this.animationTime = 200; // same as CSS transition (.show)
    this.disattachWhenHidden = true;
    this.onShown = null;
    this.onHidden = null;

    this.modal = this.backdrop.getElementsByClassName("cb-modal")[0];
    this.modalHead = this.backdrop.getElementsByClassName("cb-modal-head")[0];
    this.modalBody = this.backdrop.getElementsByClassName("cb-modal-body")[0];
    this.modalFoot = this.backdrop.getElementsByClassName("cb-modal-foot")[0];

    this.blurBackdrop = function (blur) {
        var sameLevelElements = this.backdrop.parentElement.children;

        for (var i = 0; i < sameLevelElements.length; i++) {
            var e = sameLevelElements[i];
            if (e === this.backdrop || (e.offsetWidth == 0 && e.offsetHeight == 0)) continue;
            if (blur) {
                e.classList.add("cb-modal-blur");
            } else {
                e.classList.remove("cb-modal-blur");
            }
        }
    }

    this.removeFromParent = function () {
        var parent = this.backdrop.parentElement;
        if (parent != null) parent.removeChild(this.backdrop);
    }

    this.show = function (zIndex) {
        var cbModal = this;
        this.backdrop.style.display = "block";
        this.backdrop.style.zIndex = zIndex || '5';

        // insert element on root
        if (this.backdrop.parentElement !== document.body) {
            this.removeFromParent();
            document.body.appendChild(this.backdrop);
        }

        setTimeout(function () {
            cbModal.backdrop.classList.add("show");
            setTimeout(function () {
                if (cbModal.onShown != null) cbModal.onShown();
            }, this.animationTime);
        }, 50);
        cbModal.blurBackdrop(true);

        if (document.activeElement != null) {
            document.activeElement.blur();
        }
    };

    this.hide = function () {
        this.backdrop.classList.remove("show");
        var cbModal = this;
        setTimeout(function () {
            cbModal.backdrop.style.display = "none";
            cbModal.blurBackdrop(false);
            if (cbModal.disattachWhenHidden) cbModal.removeFromParent();
            if (cbModal.onHidden != null) cbModal.onHidden();
        }, this.animationTime);
    }
}