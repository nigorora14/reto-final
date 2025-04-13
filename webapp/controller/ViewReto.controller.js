sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("ngonzano.reto.controller.ViewReto", {
        onInit() {
            var oModel = new JSONModel();
            oModel.loadData("./model/selectOptions.json");
            var oView = this.getView();

            // Setea el modelo de los selects
            oView.setModel(oModel, "selects");

            // IDs de todos los Selects
            const aSelectIds = [
                "selectTypeDoc",
                "selectPlaceBirth",
                "selectNationality",
                "selectGenre",
                "selectCivilStatus",
                "selectCountry",
                "selectProvince",
                "selectRegion"
            ];

            // Esperamos a que cargue el modelo para agregar los placeholders
            oModel.attachRequestCompleted(() => {
                aSelectIds.forEach(sId => {
                    const oSelect = oView.byId(sId);
                    if (oSelect) {
                        // Agrega el placeholder como primer item
                        oSelect.insertItem(new sap.ui.core.Item({
                            key: "",
                            text: oView.getModel("i18n").getProperty("selectPlaceholder") || "Seleccione..."
                        }), 0);

                        // Selecciona el placeholder por defecto
                        oSelect.setSelectedKey("");

                        // Asigna el mismo handler de cambio si no está asignado
                        oSelect.attachChange(this.onSelectChange.bind(this));
                    }
                });
            });
            // Crear modelo con lista vacía y header inicial
            const oUsersModel = new sap.ui.model.json.JSONModel({
                data: [],
                headerText: "Usuarios registrados (0)"
            });
            this.getView().setModel(oUsersModel, "users");

        },

        onSelectChange: function (oEvent) {
            const oSelect = oEvent.getSource();
            const sKey = oSelect.getSelectedKey();
            const aItems = oSelect.getItems();

            // Si el primer ítem tiene key="" y se selecciona otro, lo eliminamos
            if (sKey !== "" && aItems.length && aItems[0].getKey() === "") {
                oSelect.removeItem(0);
            }
        },
        onSave: function () {
            const oView = this.getView();

            // Obtener los valores de los campos
            const sTypeDoc = oView.byId("selectTypeDoc").getSelectedItem()?.getText()
            const sNumDoc = oView.byId("inputNumDoc").getValue()
            const sFirstName = oView.byId("inputFirstName").getValue()
            const sLastName = oView.byId("inputLastName").getValue()
            const sBirthDate = oView.byId("datePickerBirth").getValue()
            const sPlaceBirth = oView.byId("selectPlaceBirth").getSelectedItem()?.getText()
            const sNationality = oView.byId("selectNationality").getSelectedItem()?.getText()
            const sGenre = oView.byId("selectGenre").getSelectedItem()?.getText()
            const sCivilStatus = oView.byId("selectCivilStatus").getSelectedItem()?.getText()

            const sFullName = `${sFirstName} ${sLastName}`;
            const sDocComplete = `${sNumDoc} ${sTypeDoc}`;

            const oNewEntry = {
                document: sDocComplete,
                fullName: sFullName,
                birthDate: sBirthDate,
                placeBirth: sPlaceBirth,
                nationality: sNationality,
                genre: sGenre,
                civilStatus: sCivilStatus
            };

            // Obtener o crear el modelo de la tabla
            let oUsersModel = oView.getModel("users");
            if (!oUsersModel) {
                oUsersModel = new sap.ui.model.json.JSONModel({ data: [] });
                oView.setModel(oUsersModel, "users");
            }

            // Obtener los datos existentes y agregar el nuevo
            const aUsers = oUsersModel.getProperty("/data");
            aUsers.push(oNewEntry);
            oUsersModel.setProperty("/data", aUsers);

            const oI18n = this.getView().getModel("i18n").getResourceBundle();
            const sTitle = oI18n.getText("usersListTitle")
            const sHeader = `${sTitle} (${aUsers.length})`

            oUsersModel.setProperty("/headerText", sHeader)

        },
        onClear: function () {
            const oView = this.getView();

            // Limpiar Inputs
            oView.byId("inputId").setValue("");
            oView.byId("inputNumDoc").setValue("");
            oView.byId("inputFirstName").setValue("");
            oView.byId("inputLastName").setValue("");
            oView.byId("inputAddress").setValue("");
            oView.byId("inputPostalCode").setValue("");
            oView.byId("inputPhone").setValue("");
            oView.byId("inputEmail").setValue("");

            // Limpiar Selects
            oView.byId("selectTypeDoc").setSelectedKey("");
            oView.byId("selectPlaceBirth").setSelectedKey("");
            oView.byId("selectNationality").setSelectedKey("");
            oView.byId("selectGenre").setSelectedKey("");
            oView.byId("selectCivilStatus").setSelectedKey("");
            oView.byId("selectCountry").setSelectedKey("");
            oView.byId("selectProvince").setSelectedKey("");
            oView.byId("selectRegion").setSelectedKey("");

            // Limpiar DatePicker
            oView.byId("datePickerBirth").setValue("");

            //Limpiar tabla
            const oUsersModel = oView.getModel("users");
            if (oUsersModel) {
                oUsersModel.setProperty("/data", []);
            }
            // Actualizar header
            const oI18n = oView.getModel("i18n").getResourceBundle();
            const sTitle = oI18n.getText("usersListTitle"); // "Usuarios registrados"
            oUsersModel.setProperty("/headerText", `${sTitle} (0)`);
        },


    });


});
