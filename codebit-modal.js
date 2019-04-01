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

var showingCbModals = [];

function CbModal(element) {
    this.backdrop = element || createCbModalSkeleton();
    this.animationTime = 200; // same as CSS transition (.show)
    this.disattachWhenHidden = true;
    this.onShown = null;
    this.onHidden = null;

    var self = this;
    this.backdrop.modal = this;

    this.modal = this.backdrop.getElementsByClassName("cb-modal")[0];
    this.modalHead = this.backdrop.getElementsByClassName("cb-modal-head")[0];
    this.modalBody = this.backdrop.getElementsByClassName("cb-modal-body")[0];
    this.modalFoot = this.backdrop.getElementsByClassName("cb-modal-foot")[0];

    this.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    this.modalHead.id = this.guid();
    this.modalBody.id = this.guid();

    this.modal.setAttribute("role", "modal");
    this.modal.setAttribute("aria-modal", "true");
    this.modal.setAttribute("aria-labelledby", this.modalHead.id);
    this.modal.setAttribute("aria-describedby", this.modalBody.id);

    this.modalBody.tabIndex = -1;

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
    };

    this.removeFromParent = function () {
        var parent = this.backdrop.parentElement;
        if (parent != null) parent.removeChild(this.backdrop);
    };

    this.show = function (childOf) {
        var cbModal = this;
        this.backdrop.style.display = "block";

        var zIndex = 5;
        if (childOf != null) {
            if (childOf.backdrop == null || childOf.backdrop.style == null || childOf.backdrop.style.zIndex == null) {
                console.warn('The object passed as "childOf" is not a valid CbModal.');
            } else {
                this.childOf = childOf;
                zIndex = parseInt(childOf.backdrop.style.zIndex) + 1;
            }
        }
        this.backdrop.style.zIndex = zIndex || '5';

        document.body.classList.add('has-modal-showing');

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
            showingCbModals.push(self);
        }, 50);
        cbModal.blurBackdrop(true);

        if (document.activeElement != null) {
            document.activeElement.blur();
        }
    };

    this.setZIndex = function (zIndex) {
        this.backdrop.style.zIndex = zIndex;
    };

    this.hide = function () {
        this.backdrop.classList.remove("show");
        var cbModal = this;
        setTimeout(function () {
            cbModal.backdrop.style.display = "none";
            cbModal.blurBackdrop(false);
            if (cbModal.disattachWhenHidden) cbModal.removeFromParent();
            if (cbModal.onHidden != null) cbModal.onHidden();
            showingCbModals.splice(showingCbModals.indexOf(self));
            if (showingCbModals.length == 0) {
                document.body.classList.remove('has-modal-showing')
            }
        }, this.animationTime);
    };
}

document.addEventListener('keydown', function (e) {
    if (e.key == "Escape") {
        if (showingCbModals.length != 0) {
            var modal = showingCbModals[showingCbModals.length - 1];
            modal.hide();
            e.stopPropagation();
        }
    }
});
