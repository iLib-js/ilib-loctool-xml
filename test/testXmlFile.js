/*
 * testXmlFile.js - test the XML file handler object.
 *
 * Copyright © 2021, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var path = require("path");
var fs = require("fs");

if (!XmlFile) {
    var XmlFile = require("../XmlFile.js");
    var XmlFileType = require("../XmlFileType.js");

    var CustomProject =  require("loctool/lib/CustomProject.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
    var ResourcePlural =  require("loctool/lib/ResourcePlural.js");
    var ResourceArray =  require("loctool/lib/ResourceArray.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

var p = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: ".",
    nopseudo: true,
    xml: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "resources/en/US/strings.xml": {
                "schema": "./testfiles/schema/strings-schema.json",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            },
            "**/messages.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            },
            "**/sparse.xml": {
                "schema": "strings-schema",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse.xml"
            },
            "**/sparse2.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse2.xml"
            },
            "**/spread.xml": {
                "schema": "strings-schema",
                "method": "spread",
                "template": "resources/[localeDir]/spread.xml"
            },
            "**/deep.xml": {
                "schema": "http://github.com/ilib-js/deep.json",
                "method": "copy",
                "template": "resources/deep_[locale].xml"
            },
            "**/refs.xml": {
                "schema": "http://github.com/ilib-js/refs.json",
                "method": "copy",
                "template": "resources/[locale]/refs.xml"
            },
            "**/str.xml": {},
            "**/arrays.xml": {
                "schema": "http://github.com/ilib-js/arrays.json",
                "method": "copy",
                "template": "resources/[localeDir]/arrays.xml"
            },
            "**/array-refs.xml": {
                "schema": "http://github.com/ilib-js/array-refs.json",
                "method": "copy",
                "template": "resources/[localeDir]/array-refs.xml"
            }
        }
    }
});
var t = new XmlFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    targetDir: "testfiles",
    nopseudo: false,
    xml: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "**/messages.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            }
        }
    }
});

var t2 = new XmlFileType(p2);

module.exports.xmlfile = {
    testXmlFileConstructor: function(test) {
        test.expect(1);

        var xf = new XmlFile({project: p, type: t});
        test.ok(xf);

        test.done();
    },

    testXmlFileConstructorParams: function(test) {
        test.expect(1);

        var xf = new XmlFile({
            project: p,
            pathName: "./testfiles/xml/messages.xml",
            type: t
        });

        test.ok(xf);

        test.done();
    },

    testXmlFileConstructorNoFile: function(test) {
        test.expect(1);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        test.done();
    },

    testXmlFileEscapeProp: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testXmlFileEscapePropNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("permissions"), "permissions");

        test.done();
    },

    testXmlFileEscapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileUnescapeProp: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testXmlFileUnescapePropTricky: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testXmlFileUnescapePropNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("permissions"), "permissions");

        test.done();
    },

    testXmlFileUnescapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileEscapeRef: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testXmlFileEscapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("permissions"), "permissions");

        test.done();
    },

    testXmlFileEscapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("permissions% \" ^ | \\"), "permissions%25%20%22%20%5E%20%7C%20%5C");

        test.done();
    },

    testXmlFileUnescapeRef: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testXmlFileUnescapeRefTricky: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testXmlFileUnescapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("permissions"), "permissions");

        test.done();
    },

    testXmlFileUnescapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "xml"));
        test.ok(r);

        test.equal(r.getSource(), "this is string one");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

    testXmlFileParseSimpleRightStrings: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "string 2");

        test.done();
    },

    testXmlFileParseSimpleDontExtractEmpty: function(test) {
        test.expect(6);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": ""\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testXmlFileParseEscapeStringKeys: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "/user": "this is string one",\n' +
           '    "~tilde": "this is string two"\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "/user");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "~tilde");

        test.done();
    },

    testXmlFileParseSimpleRejectThingsThatAreNotInTheSchema: function(test) {
        test.expect(6);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": {\n' +
           '        "asdf": "asdf"\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testXmlFileParseComplexRightSize: function(test) {
        test.expect(3);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        test.done();
    },

    testXmlFileParseComplexRightStrings: function(test) {
        test.expect(26);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "plurals/bar");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "singular");
        test.equal(pluralStrings.many, "many");
        test.equal(pluralStrings.other, "plural");
        test.ok(!pluralStrings.zero);
        test.ok(!pluralStrings.two);
        test.ok(!pluralStrings.few);

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "b");
        test.equal(resources[1].getKey(), "strings/a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "strings/c");

        test.equal(resources[3].getType(), "array");
        test.equal(resources[3].getKey(), "arrays/asdf");
        var arrayStrings = resources[3].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "string 1");
        test.equal(arrayStrings[1], "string 2");
        test.equal(arrayStrings[2], "string 3");

        test.done();
    },

    testXmlFileParseArrayOfStrings: function(test) {
        test.expect(11);

        // when it's named arrays.xml, it should apply the arrays schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "strings": [\n' +
                '    "string 1",\n' +
                '    "string 2",\n' +
                '    "string 3"\n' +
                '  ]\n' +
                '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'strings');

        var arrayStrings = resources[0].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "string 1");
        test.equal(arrayStrings[1], "string 2");
        test.equal(arrayStrings[2], "string 3");

        test.done();
    },

    testXmlFileParseArrayOfNumbers: function(test) {
        test.expect(12);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "numbers": [\n' +
                '    15,\n' +
                '    -3,\n' +
                '    1.18,\n' +
                '    0\n' +
                '  ]\n' +
                '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'numbers');

        var arrayNumbers = resources[0].getSourceArray();
        test.ok(arrayNumbers);
        test.equal(arrayNumbers.length, 4);
        test.equal(arrayNumbers[0], "15");
        test.equal(arrayNumbers[1], "-3");
        test.equal(arrayNumbers[2], "1.18");
        test.equal(arrayNumbers[3], "0");

        test.done();
    },

    testXmlFileParseArrayOfBooleans: function(test) {
        test.expect(10);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "booleans": [\n' +
                '    true,\n' +
                '    false\n' +
                '  ]\n' +
                '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'booleans');

        var arrayBooleans = resources[0].getSourceArray();
        test.ok(arrayBooleans);
        test.equal(arrayBooleans.length, 2);
        test.equal(arrayBooleans[0], "true");
        test.equal(arrayBooleans[1], "false");

        test.done();
    },

    testXmlFileParseArrayOfObjects: function(test) {
        test.expect(13);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "objects": [\n' +
                '    {\n' +
                '      "name": "First Object",\n' +
                '      "randomProp": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "name": "Second Object",\n' +
                '      "description": "String property"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 3);

        var resources = set.getAll();
        test.equal(resources.length, 3);
        test.equal(resources[0].getType(), 'string');
        test.equal(resources[0].getKey(), 'objects/item_0/name');
        test.equal(resources[0].getSource(), 'First Object');

        test.equal(resources[1].getType(), 'string');
        test.equal(resources[1].getKey(), 'objects/item_1/name');
        test.equal(resources[1].getSource(), 'Second Object');

        test.equal(resources[2].getType(), 'string');
        test.equal(resources[2].getKey(), 'objects/item_1/description');
        test.equal(resources[2].getSource(), 'String property');

        test.done();
    },

    testXmlFileParseArrayWithRef: function(test) {
        test.expect(10);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/array-refs.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "itemsArray": [\n' +
                '    {\n' +
                '      "itemField": "First item",\n' +
                '      "itemFieldIgnore": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "itemField": "Second item",\n' +
                '      "itemFieldIgnore": "Non-translatable"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 2);

        var resources = set.getAll();
        test.equal(resources.length, 2);
        test.equal(resources[0].getType(), 'string');
        test.equal(resources[0].getKey(), 'itemsArray/item_0/itemField');
        test.equal(resources[0].getSource(), 'First item');

        test.equal(resources[1].getType(), 'string');
        test.equal(resources[1].getKey(), 'itemsArray/item_1/itemField');
        test.equal(resources[1].getSource(), 'Second item');

        test.done();
    },

    testXmlFileParseDeepRightSize: function(test) {
        test.expect(3);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "x": {\n' +
           '        "y": {\n' +
           '            "plurals": {\n' +
           '                "bar": {\n' +
           '                    "one": "singular",\n' +
           '                    "many": "many",\n' +
           '                    "other": "plural"\n' +
           '                 }\n' +
           '            }\n' +
           '        }\n' +
           '    },\n' +
           '    "a": {\n' +
           '        "b": {\n' +
           '            "strings": {\n' +
           '                "a": "b",\n' +
           '                "c": "d"\n' +
           '            }\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testXmlFileParseDeepRightStrings: function(test) {
        test.expect(19);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "x": {\n' +
           '        "y": {\n' +
           '            "plurals": {\n' +
           '                "bar": {\n' +
           '                    "one": "singular",\n' +
           '                    "many": "many",\n' +
           '                    "other": "plural"\n' +
           '                 }\n' +
           '            }\n' +
           '        }\n' +
           '    },\n' +
           '    "a": {\n' +
           '        "b": {\n' +
           '            "strings": {\n' +
           '                "a": "b",\n' +
           '                "c": "d"\n' +
           '            }\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        var resources = set.getAll();
        test.equal(resources.length, 3);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "x/y/plurals/bar");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "singular");
        test.equal(pluralStrings.many, "many");
        test.equal(pluralStrings.other, "plural");
        test.ok(!pluralStrings.zero);
        test.ok(!pluralStrings.two);
        test.ok(!pluralStrings.few);

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "b");
        test.equal(resources[1].getKey(), "a/b/strings/a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "a/b/strings/c");

        test.done();
    },

    testXmlFileParseTestInvalidXml: function(test) {
        test.expect(2);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        test.throws(function(test) {
            xf.parse(
               '{\n' +
               '    "x": {\n' +
               '        "y": {,@#\n' +
               '            "plurals": {\n' +
               '                "bar": {\n' +
               '                    "one": "singular",\n' +
               '                    "many": "many",\n' +
               '                    "other": "plural"\n' +
               '                 }\n' +
               '            }\n' +
               '        }\n' +
               '    },\n' +
               '    "a": {\n' +
               '        "b": {\n' +
               '            "strings": {\n' +
               '                "a": "b",\n' +
               '                "c": "d"\n' +
               '            }\n' +
               '        }\n' +
               '    }\n' +
               '}\n');
        });

        test.done();
    },

    testXmlFileParseRefsRightSize: function(test) {
        test.expect(3);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "owner": {\n' +
           '        "name": "Foo Bar",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Mobile"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer1": {\n' +
           '        "name": "Customer One",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Home"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer2": {\n' +
           '        "name": "Customer Two",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Work"\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testXmlFileParseRefsRightStrings: function(test) {
        test.expect(13);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "owner": {\n' +
           '        "name": "Foo Bar",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Mobile"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer1": {\n' +
           '        "name": "Customer One",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Home"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer2": {\n' +
           '        "name": "Customer Two",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Work"\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        var resources = set.getAll();
        test.equal(resources.length, 3);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "Mobile");
        test.equal(resources[0].getKey(), "owner/phone/type");

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "Home");
        test.equal(resources[1].getKey(), "customer1/phone/type");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "Work");
        test.equal(resources[2].getKey(), "customer2/phone/type");

        test.done();
    },

    testXmlFileParseDefaultSchema: function(test) {
        test.expect(5);

        var xf = new XmlFile({
            project: p,
            pathName: "a/b/c/str.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "xml"));
        test.ok(r);

        test.equal(r.getSource(), "this is string one");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

/*
    can't do comments yet

    testXmlFileParseExtractComments: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    // comment for string 1\,' +
           '    "string 1": "this is string one",\n' +
           '    // comment for string 2\,' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getNote(), "comment for string 1");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "string 2");

        test.done();
    },

*/

    testXmlFileExtractFile: function(test) {
        test.expect(28);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 5);

        var resources = set.getAll();
        test.equal(resources.length, 5);

        test.equal(resources[0].getType(), "plural");
        var categories = resources[0].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one");
        test.equal(categories.other, "other");
        test.equal(resources[0].getKey(), "plurals/bar");

        test.equal(resources[1].getType(), "array");
        var arr = resources[1].getSourceArray();
        test.ok(arr);
        test.equal(arr.length, 3);
        test.equal(arr[0], "value 1");
        test.equal(arr[1], "value 2");
        test.equal(arr[2], "value 3");
        test.equal(resources[1].getKey(), "arrays/asdf");

        test.equal(resources[2].getType(), "array");
        var arr = resources[2].getSourceArray();
        test.ok(arr);
        test.equal(arr.length, 3);
        test.equal(arr[0], "1");
        test.equal(arr[1], "2");
        test.equal(arr[2], "3");
        test.equal(resources[2].getKey(), "arrays/asdfasdf");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "b");
        test.equal(resources[3].getKey(), "strings/a");

        test.equal(resources[4].getType(), "string");
        test.equal(resources[4].getSource(), "d");
        test.equal(resources[4].getKey(), "strings/c");

        test.done();
    },

    testXmlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testXmlFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/bogus.xml",
            type: t
        });
        test.ok(xf);

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testXmlFileLocalizeTextSimple: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextWithSchema: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b",\n' +
           '        "c": "la d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "chaîne 1",\n' +
           '            "chaîne 2",\n' +
           '            "chaîne 3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextMethodSparse: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextWithSchemaSparseComplex: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeArrayOfStrings: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "strings": [\n' +
                '    "string 1",\n' +
                '    "string 2",\n' +
                '    "string 3"\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "strings",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "strings": [\n' +
                '        "chaîne 1",\n' +
                '        "chaîne 2",\n' +
                '        "chaîne 3"\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeArrayOfNumbers: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "numbers": [\n' +
                '    15,\n' +
                '    -3,\n' +
                '    1.18,\n' +
                '    0\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "numbers",
            sourceArray: [
                "15",
                "-3",
                "1.18",
                "0"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "29",
                "12",
                "-17.3",
                "0"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "numbers": [\n' +
                '        29,\n' +
                '        12,\n' +
                '        -17.3,\n' +
                '        0\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeArrayOfBooleans: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "booleans": [\n' +
                '    true,\n' +
                '    false\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "booleans",
            sourceArray: [
                "true",
                "false"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "false",
                "true"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "booleans": [\n' +
                '        false,\n' +
                '        true\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeArrayOfObjects: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
                '  "objects": [\n' +
                '    {\n' +
                '      "name": "First Object",\n' +
                '      "randomProp": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "name": "Second Object",\n' +
                '      "description": "String property"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_0/name",
            source: "First Object",
            sourceLocale: "en-US",
            target: "Premier objet",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_1/name",
            source: "Second Object",
            sourceLocale: "en-US",
            target: "Deuxième objet",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_1/description",
            source: "String Property",
            sourceLocale: "en-US",
            target: "Propriété String",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "objects": [\n' +
                '        {\n' +
                '            "name": "Premier objet",\n' +
                '            "randomProp": "Non-translatable"\n' +
                '        },\n' +
                '        {\n' +
                '            "name": "Deuxième objet",\n' +
                '            "description": "Propriété String"\n' +
                '        }\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeArrayOfObjectsWithBooleansOnly: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse('{\n' +
            '  "objects": [\n' +
            '    {\n' +
            '      "nullable": false\n' +
            '    },\n' +
            '    {\n' +
            '      "nullable": true\n' +
            '    }\n' +
            '  ]\n' +
            '}\n');

        var translations = new TranslationSet('en-US');

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '{\n' +
            '    "objects": [\n' +
            '        {\n' +
            '            "nullable": false\n' +
            '        },\n' +
            '        {\n' +
            '            "nullable": true\n' +
            '        }\n' +
            '    ]\n' +
            '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeTextUsePseudoForMissing: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p2,
            pathName: "./xml/messages.xml",
            type: t2
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n');

        var translations = new TranslationSet();

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "šíñğüľàŕ3210",\n' +
           '            "many": "màñÿ10",\n' +
           '            "other": "þľüŕàľ210"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b0",\n' +
           '        "c": "ð0"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "šţŕíñğ 13210",\n' +
           '            "šţŕíñğ 23210",\n' +
           '            "šţŕíñğ 33210"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

/*
    not implemented yet

    testXmlFileLocalizeTextMethodSpread: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "string 1": {\n' +
           '        "fr-FR": "C\'est la chaîne numéro 1",\n' +
           '    },\n' +
           '    "string 2": {\n' +
           '        "fr-FR": "C\'est la chaîne numéro 2"\n' +
           '    },\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextMethodSpreadMultilingual: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 1",
            targetLocale: "de",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 2",
            targetLocale: "de",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, ["fr-FR", "de"]);
        var expected =
           '{\n' +
           '    "string 1": {\n' +
           '        "fr-FR": "C\'est la chaîne numéro 1",\n' +
           '        "de": "Dies ist die Zeichenfolge 1",\n' +
           '    },\n' +
           '    "string 2": {\n' +
           '        "fr-FR": "C\'est la chaîne numéro 2"\n' +
           '        "de": "Dies ist die Zeichenfolge 2"\n' +
           '    },\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },
*/

    testXmlFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "Der d",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "Zeichenfolge 1",
                "Zeichenfolge 2",
                "Zeichenfolge 3"
            ],
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "chaîne 1",\n' +
           '            "chaîne 2",\n' +
           '            "chaîne 3"\n' +
           '        ],\n' +
           '        "asdfasdf": [\n' +
           '            "1",\n' +
           '            "2",\n' +
           '            "3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b",\n' +
           '        "c": "la d"\n' +
           '    }\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.xml"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "einslige",\n' +
           '            "many": "mehrere",\n' +
           '            "other": "andere"\n' +
           '        }\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "Zeichenfolge 1",\n' +
           '            "Zeichenfolge 2",\n' +
           '            "Zeichenfolge 3"\n' +
           '        ],\n' +
           '        "asdfasdf": [\n' +
           '            "1",\n' +
           '            "2",\n' +
           '            "3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "Die b",\n' +
           '        "c": "Der d"\n' +
           '    }\n' +
           '}\n';
        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testXmlFileLocalizeNoTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        test.done();
    },

    testXmlFileLocalizeMethodSparse: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        // should only contain the things that were actually translated
        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b"\n' +
           '    }\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "einslige",\n' +
           '            "many": "mehrere",\n' +
           '            "other": "andere"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "Die b"\n' +
           '    }\n' +
           '}\n';
        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testXmlFileLocalizeExtractNewStrings: function(test) {
        test.expect(43);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        // make sure we start off with no new strings
        t.newres.clear();
        test.equal(t.newres.size(), 0);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        test.equal(t.newres.size(), 7);
        var resources = t.newres.getAll();
        test.equal(resources.length, 7);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "plurals/bar");
        test.equal(resources[0].getTargetLocale(), "fr-FR");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "one");
        test.equal(pluralStrings.other, "other");
        pluralStrings = resources[0].getTargetPlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "one");
        test.equal(pluralStrings.other, "other");

        test.equal(resources[1].getType(), "array");
        test.equal(resources[1].getKey(), "arrays/asdf");
        test.equal(resources[1].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[1].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");
        arrayStrings = resources[1].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");

        test.equal(resources[2].getType(), "array");
        test.equal(resources[2].getKey(), "arrays/asdfasdf");
        test.equal(resources[2].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[2].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");
        arrayStrings = resources[2].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "d");
        test.equal(resources[3].getKey(), "strings/c");
        test.equal(resources[3].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXmlFileLocalizeWithAlternateFileNameTemplate: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/deep.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml")));

        test.done();
    },

    testXmlFileLocalizeDefaultMethodAndTemplate: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "x/y/str.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        // default template is resources/[localeDir]/[filename]
        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/str.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml")));

        xf.localize(translations, ["fr-FR"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/str.xml"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    }
};
