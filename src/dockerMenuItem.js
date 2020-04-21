/*
 * Gnome3 Docker Menu Extension
 * Copyright (C) 2017 Guillaume Pouilloux <gui.pouilloux@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Config = imports.misc.config;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Docker = Me.imports.src.docker;
const GObject = imports.gi.GObject;

// Docker actions for each container
let DockerMenuItem = class DockerMenuItem extends PopupMenu.PopupMenuItem {

    _init(containerName, dockerCommand) {
        super._init(Docker.dockerCommandsToLabels[dockerCommand]);

        this.containerName = containerName;
        this.dockerCommand = dockerCommand;

        this.connect('activate', this._dockerAction.bind(this));
    }

    _dockerAction() {
        Docker.runCommand(this.dockerCommand, this.containerName, (res) => {
            if (!!res) {
                log("`" + this.dockerCommand + "` terminated successfully");
            } else {
                let errMsg = _(
                    "Docker: Failed to '" + 
                    this.dockerCommand + "' container '" + this.containerName + "'"
                );
                Main.notify(errMsg);
                log(errMsg);
            }
        });
    }
}

const gnomeShellMajor = parseInt(Config.PACKAGE_VERSION.split('.')[0]);
const gnomeShellMinor = parseInt(Config.PACKAGE_VERSION.split('.')[1]);

if (gnomeShellMajor === 3 && gnomeShellMinor >= 30) {
    DockerMenuItem = GObject.registerClass(
        { GTypeName: 'DockerMenuItem' },
        DockerMenuItem
    );
}
