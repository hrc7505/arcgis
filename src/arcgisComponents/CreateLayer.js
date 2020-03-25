import React from "react";
import ArcGISUtility from "../ArcGISUtility";

export default class CreateLayer extends React.Component {
    optionTags = [];
    titleRef = React.createRef();
    serviceNameRef = React.createRef();
    tagsRef = React.createRef();
    newTagRef = React.createRef();
    geometryOptions = [
        { text: "Points", value: "esriGeometryPoint" },
        { text: "Lines", value: "esriGeometryPolyline" },
        { text: "Polygons", value: "esriGeometryPolygon" }
    ];
    geometryRef = React.createRef();
    spatialReferenceRef = React.createRef();
    fields = [];
    fieldNameRef = React.createRef();
    fieldAliasRef = React.createRef();
    fieldTypeRef = React.createRef();
    fieldTypeOptions = [
        { text: "String", value: "esriFieldTypeString" },
        { text: "Integer", value: "esriFieldTypeInteger" },
        { text: "Double", value: "esriFieldTypeDouble" },
        { text: "Date", value: "esriFieldTypeDate" },
    ];
    allowAtachmentRef = React.createRef();
    accessTypeOptions = [
        { text: "Me(Private)", value: "private" },
        { text: "My Organization(Wecreate)", value: "org" },
        { text: "Everyone(Public)", value: "public" },
    ];
    accessTypeRef = React.createRef();
    groupOptions = [];
    groupsRef = React.createRef();

    render() {
        return (
            <div>
                {this.renderFieldSet(
                    "Details",
                    <>
                        <tr>{this.renderField("Title", "textbox", null, this.titleRef)}</tr>
                        <tr>
                            {this.renderField("Tags", "select", this.optionTags, this.tagsRef, true)}
                            {this.renderField("New Tags", "textbox", null, this.newTagRef)}
                        </tr>
                    </>
                )}
                {this.renderFieldSet(
                    "Geometry",
                    <>
                        <tr>{this.renderField("Geometry", "select", this.geometryOptions, this.geometryRef)}</tr>
                        <tr>{this.renderField("Spatial Reference", "textbox", null, this.spatialReferenceRef)}</tr>
                    </>
                )}
                {this.renderFieldSet(
                    "Fields",
                    <>
                        {this.renderFields()}
                        <tr><td colSpan={2}><h3>Add Field</h3></td></tr>
                        <tr>{this.renderField("Name", "textbox", null, this.fieldNameRef)}</tr>
                        <tr>{this.renderField("Alias", "textbox", null, this.fieldAliasRef)}</tr>
                        <tr>{this.renderField("Type", "select", this.fieldTypeOptions, this.fieldTypeRef)}</tr>
                        <tr><td colSpan={2}><button onClick={this.addField}>Add Field</button></td></tr>
                    </>
                )}
                {this.renderFieldSet(
                    "Settings",
                    <>
                        <tr><td><h3>Attachment Settings</h3></td></tr>
                        <tr>{this.renderField("Allow attached images and other files to individual features.", "checkbox", null, this.allowAtachmentRef)}</tr>

                        <tr><td><h3>Share Layer</h3></td></tr>
                        <tr>{this.renderField("This layer can be accessed by:", "select", this.accessTypeOptions, this.accessTypeRef)}</tr>
                        <tr>{this.renderField("And members of these groups:", "select", this.groupOptions, this.groupsRef, true)}</tr>
                        <tr><td colSpan={2}>These settings will replace the current sharing settings.</td></tr>

                        <tr><td><h3>Permission Settings</h3></td></tr>
                        <tr><td colSpan={2}>These settings apply to other ArcGIS Online users with whom you have shared your layer. You always have permission to edit your own layers.</td></tr>
                        <tr>{this.renderField("Enable editing.", "checkbox", null, this.allowAtachmentRef)}</tr>
                        <tr>{this.renderField("Keep track of created and updated features.", "checkbox", null, this.allowAtachmentRef)}</tr>
                        <tr>{this.renderField("Keep track of who created and last updated features.", "checkbox", null, this.allowAtachmentRef)}</tr>
                        <tr>{this.renderField("Enable Sync (layer can be taken offline to be viewed, edited, and synchronized).", "checkbox", null, this.allowAtachmentRef)}</tr>
                        <tr><td colSpan={2}>What kind of editing is allowed?</td></tr>
                        <tr>{this.renderRadio("1", 0, "editRadio", "Add, update, and delete features")}</tr>
                        <tr>{this.renderRadio("2", 1, "editRadio", "Only update feature attributes")}</tr>
                        <tr>{this.renderRadio("3", 2, "editRadio", "Only add new features")}</tr>
                        <tr><td colSpan={2}>What features can editors see?</td></tr>
                        <tr>{this.renderRadio("4", 0, "seeFetures", "Editors can see all features")}</tr>
                        <tr>{this.renderRadio("5", 1, "seeFetures", "Editors can only see their own features (requires tracking)")}</tr>
                        <tr>{this.renderRadio("6", 2, "seeFetures", "Editors can't see any features, even those they add")}</tr>
                        <tr><td colSpan={2}>What features can editors edit?</td></tr>
                        <tr>{this.renderRadio("7", 0, "editFetures", "Editors can edit all features")}</tr>
                        <tr>{this.renderRadio("8", 2, "editFetures", "Editors can only edit their own features (requires tracking)")}</tr>
                        <tr><td colSpan={2}>What access do anonymous editors (not signed in) have?</td></tr>
                        <tr>{this.renderRadio("9", 0, "anonymusEditorsAccess", "The same as signed in editors")}</tr>
                        <tr>{this.renderRadio("10", 2, "anonymusEditorsAccess", "Only add new features, if allowed above (requires tracking)")}</tr>
                        <tr><td colSpan={2}>Who can manage edits?</td></tr>
                        <tr>
                            <td>
                                <ul>
                                    <li>You</li>
                                    <li>Administrators</li>
                                    <li>Data curators with the appropriate privileges</li>
                                </ul>
                            </td>
                        </tr>
                    </>
                )}
            </div>
        );
    }

    async componentDidMount() {
        const data = await ArcGISUtility.getTags();
        this.optionTags = data.tags.map((tag) => ({ text: tag.tag, value: tag.tag }));
        const userDetails = await ArcGISUtility.getUserDetails();
        this.groupOptions = userDetails.groups.map((group) => ({ text: group.title, value: group.id }));
        this.forceUpdate();
    }

    addField = () => {
        this.fields.push({
            name: this.fieldNameRef.current.value,
            alias: this.fieldAliasRef.current.value,
            type: this.fieldTypeRef.current.value
        });
        this.fieldNameRef.current.value = "";
        this.fieldAliasRef.current.value = "";
        this.fieldTypeRef.current.value = this.fieldTypeOptions[0].value;
        this.forceUpdate();
    }

    removeField = (i) => {
        this.fields = this.fields.filter((f, index) => i !== index);
        this.forceUpdate();
    }

    handleRadioChange = (e, checkedIndex) => {
        e.persist();
        this[e.target.name] = checkedIndex;
        this.forceUpdate();
    }

    renderField(label, fieldType, options, ref, hasMultipleSelection) {
        let field;
        if (fieldType === "textbox") {
            field = <input type="text" ref={ref} defaultValue={label === "Spatial Reference" ? "4326" : ""} />;
        } else if (fieldType === "select") {
            field = (
                <select ref={ref} multiple={hasMultipleSelection}>
                    {options.map((option, i) => <option key={i} value={option.value}>{option.text}</option>)}
                </select>
            )
        } else if (fieldType === "checkbox") {
            return (
                <td colSpan={2}>
                    <label htmlFor={label}>
                        <input type="checkbox" ref={ref} id={label} />{label}
                    </label>
                </td>
            );
        }

        return (
            <>
                <td><label>{label}</label></td>
                <td>{field}</td>
            </>
        );
    }

    renderFieldSet(title, tableRows) {
        return (
            <fieldset>
                <legend>{title}</legend>
                <table>
                    {tableRows}
                </table>
            </fieldset>
        );
    }

    renderRadio = (id, index, name, label) => (
        <td colSpan={2}>
            <label htmlFor={id}>
                <input
                    type="radio"
                    onChange={(e) => this.handleRadioChange(e, index)}
                    name={name}
                    id={id}
                    checked={this[name] === index}
                />
                {label}
            </label>
        </td>
    );

    renderFields = () => (
        <tr><td colSpan={2}>
            <table border={1}>
                <tr>
                    <th>Field Name</th>
                    <th>Field Alias</th>
                    <th>Field Type</th>
                    <th>Domain</th>
                    <th>Required</th>
                    <th>Delete</th>
                </tr>
                {
                    this.fields.length > 0
                        ? this.fields.map((field, i) => (
                            <tr key={i}>
                                <td>{field.name}</td>
                                <td>{field.alias}</td>
                                <td>{(this.fieldTypeOptions.find((option) => option.value === field.type)).text}</td>
                                <td>{field.domain}</td>
                                <td>{field.required}</td>
                                <td><button onClick={() => this.removeField(i)}>X</button></td>
                            </tr>
                        ))
                        : <tr><td colSpan={6}>Layers need to have at least one data field.</td></tr>
                }
            </table>
        </td></tr>
    );
}