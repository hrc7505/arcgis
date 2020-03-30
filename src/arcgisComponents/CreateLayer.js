import React from "react";
import ArcGISUtility from "../ArcGISUtility";

export default class CreateLayer extends React.Component {
    optionTags = [];
    titleRef = React.createRef();
    tagsRef = React.createRef();
    newTagRef = React.createRef();
    geometryOptions = [
        { text: "Points", value: "esriGeometryPoint" },
        { text: "Lines", value: "esriGeometryPolyline" },
        { text: "Polygons", value: "esriGeometryPolygon" }
    ];
    geometryRef = React.createRef();
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
    isServiceNameAvailable = false;
    serviceName = "";
    selectedWizardIndex = 0;
    steps = [
        () => this.renderFieldSet(
            "Details",
            <>
                <tr>
                    {this.renderField("Title", "textbox", null, this.titleRef)}
                    <td>{this.isServiceNameAvailable ? "✔" : "x"}</td>
                </tr>
                <tr>
                    <td>Service Name</td>
                    <td>{this.serviceName}</td>
                </tr>
                <tr>
                    {this.renderField("Tags", "select", this.optionTags, this.tagsRef, true)}
                    {this.renderField("New Tags", "textbox", null, this.newTagRef)}
                </tr>
                <tr></tr>
            </>
        ),
        () => this.renderFieldSet(
            "Geometry",
            <tr>{this.renderField("Geometry", "select", this.geometryOptions, this.geometryRef)}</tr>
        ),
        () => this.renderFieldSet(
            "Seelect map extent",
            <>
                <tr>
                    <td colSpan={2} id="extentSelector">

                    </td>
                </tr>
            </>
        ),
        () => this.renderFieldSet(
            "Fields",
            <>
                {this.renderFields()}
                <tr><td colSpan={2}><h3>Add Field</h3></td></tr>
                <tr>{this.renderField("Name", "textbox", null, this.fieldNameRef)}</tr>
                <tr>{this.renderField("Alias", "textbox", null, this.fieldAliasRef)}</tr>
                <tr>{this.renderField("Type", "select", this.fieldTypeOptions, this.fieldTypeRef)}</tr>
                <tr><td colSpan={2}><button onClick={this.addField}>Add Field</button></td></tr>
            </>
        ),
    ];

    render() {
        return (
            <div>
                {this.steps.map((step, i) => (
                    <React.Fragment key={i}>
                        {this.selectedWizardIndex === i && step()}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    async componentDidMount() {
        if (this.titleRef) {
            this.titleRef.current.addEventListener("input", this.checkName);
        }
        try {
            await ArcGISUtility.getPortalData();
            const data = await ArcGISUtility.getTags();
            this.optionTags = data && data.tags ? data.tags.map((tag) => ({ text: tag.tag, value: tag.tag })) : [];
            const userDetails = await ArcGISUtility.getUserDetails();
            this.groupOptions = userDetails && userDetails.groups ? userDetails.groups.map((group) => ({ text: group.title, value: group.id })) : [];
            this.forceUpdate();
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        if (this.titleRef) {
            this.titleRef.current.removeEventListener("input", this.checkName);
        }
    }

    checkName = async (e) => {
        this.isServiceNameAvailable = await ArcGISUtility.isServiceNameAvailable(e.target.value);
        this.serviceName = e.target.value.replace(/ /g, "_").toLowerCase();
        this.forceUpdate();
    }

    selectFile = () => {

    }

    createLayer = async () => {
        /* console.log("this.tagsRef.current.value",this.tagsRef.current.value);
        
        const selectedTags = this.tagsRef.current.value ? this.tagsRef.current.value : "";
        const tags = selectedTags ? (selectedTags + "," + this.newTagRef.current.value) : this.newTagRef.current.value;
        await ArcGISUtility.createService(tags, this.serviceName); */
        //  ArcGISUtility.update(this.selectedFileBinary);
        //  ArcGISUtility.addToDefinations(this.selectedFileBinary);
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

    renderFieldSet = (title, tableRows) => (
        <fieldset>
            <legend>{title}</legend>
            <table>
                {tableRows}
                <tr>
                    {this.selectedWizardIndex > 0 && <td><button onClick={this.moveToPrevious}>Previous</button></td>}
                    {(this.selectedWizardIndex < this.steps.length - 1) && <td><button onClick={this.moveToNext}>Next</button></td>}
                    {(this.selectedWizardIndex === this.steps.length - 1) && <td><button onClick={this.createLayer}>Create Layer</button></td>}
                </tr>
            </table>
        </fieldset>
    );

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

    moveToNext = () => {
        this.selectedWizardIndex += 1;
        this.forceUpdate();
    }

    moveToPrevious = () => {
        this.selectedWizardIndex -= 1;
        this.forceUpdate();
    }
}