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
    accessTypeRef=React.createRef();

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
                        <tr>{this.renderField("This layer can be accessed by:", "select", this.accessTypeOptions, this.accessTypeRef)}</tr>
                    </>
                )}
            </div>
        );
    }

    async componentDidMount() {
        const data = await ArcGISUtility.getTags();
        this.optionTags = data.tags.map((tag) => ({ text: tag.tag, value: tag.tag }));
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