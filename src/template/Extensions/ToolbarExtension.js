function ToolbarExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

ToolbarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolbarExtension.prototype.constructor = ToolbarExtension;

ToolbarExtension.prototype.load = function() {
    // Set background environment to "Infinity Pool"
    // and make sure the environment background texture is visible
    // this.viewer.setLightPreset(1);
    this.viewer.setEnvMapBackground(true);

    // Ensure the model is centered
    this.viewer.fitToView();

    return true;
};

ToolbarExtension.prototype.unload = function() {
    // nothing yet
};
ToolbarExtension.prototype.onToolbarCreated = function(toolbar) {

};
ToolbarExtension.prototype.onToolbarCreated = function(toolbar) {

    let viewer = this.viewer;
    let panel = this.panel;
    // button to show the docking panel
    var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('devPanel');
    toolbarButtonShowDockingPanel.onClick = function (e) {
        // if null, create it
        if (panel == null) {
            panel = new SearchPanel(viewer, viewer.container,
                'devPanel', 'Search Model');
        }
        // show/hide docking panel
        panel.setVisible(!panel.isVisible());
    };
    toolbarButtonShowDockingPanel.addClass('search-button');
    toolbarButtonShowDockingPanel.setToolTip('Search Model');
    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('dev-toolbar');
    this.subToolbar.addControl(toolbarButtonShowDockingPanel);
    toolbar.addControl(this.subToolbar);
};

ToolbarExtension.prototype.unload = function() {
    if (this.subToolbar) {
        this.viewer.toolbar.removeControl(this.subToolbar);
        this.subToolbar = null;
    }
};
Autodesk.Viewing.theExtensionManager.registerExtension('ToolbarExtension', ToolbarExtension);
