/*
 * testXmlFileType.js - test the XML file type handler object.
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

if (!XmlFileType) {
    var XmlFileType = require("../XmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
        "mappings": {
            "strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings2.xml"
            },
            "resources/en/US/strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            },
            "**/messages.xml": {
                "schema": "http://www.lge.com/xml/messages",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            },
            "**/test/str.jsn": {
                "schema": "http://www.lge.com/xml/str",
                "method": "copy",
                "template": "[dir]/[localeDir]/str.xml"
            }
        }
    }
});


var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
        mappings: {
            "**/strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            }
        }
    }
});


module.exports.xmlfiletype = {
    testXmlFileTypeConstructor: function(test) {
        test.expect(1);

        var xft = new XmlFileType(p);

        test.ok(xft);

        test.done();
    },

    testXmlFileTypeGetLocalizedPathLocaleDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('resources/[localeDir]/strings.xml', "x/y/strings.xml", "de-DE"), "resources/de/DE/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/[localeDir]/strings.xml', "x/y/strings.xml", "de-DE"), "x/y/de/DE/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathBasename: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[localeDir]/tr-[basename].j', "x/y/strings.xml", "de-DE"), "de/DE/tr-strings.j");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathFilename: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[localeDir]/tr-[filename]', "x/y/strings.xml", "de-DE"), "de/DE/tr-strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathExtension: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[localeDir]/tr-foobar.[extension]', "x/y/strings.jsn", "de-DE"), "de/DE/tr-foobar.jsn");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathLocale: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/[locale]/strings.xml', "x/y/strings.xml", "de-DE"), "x/y/de-DE/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathLanguage: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/[language]/strings.xml', "x/y/strings.xml", "de-DE"), "x/y/de/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathRegion: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/[region]/strings.xml', "x/y/strings.xml", "de-DE"), "x/y/DE/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathScript: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/[script]/strings.xml', "x/y/strings.xml", "zh-Hans-CN"), "x/y/Hans/strings.xml");

        test.done();
    },

    testXmlFileTypeGetLocalizedPathLocaleUnder: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocalizedPath('[dir]/strings_[localeUnder].xml', "x/y/strings.xml", "zh-Hans-CN"), "x/y/strings_zh_Hans_CN.xml");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/strings.xml', "x/y/strings.xml"), "");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathBasename: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[basename].xml', "x/y/strings.xml"), "");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathFilename: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[filename]', "x/y/strings.xml"), "");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathLocale: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[locale]/strings.xml', "x/y/de-DE/strings.xml"), "de-DE");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathLocaleLong: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[locale]/strings.xml', "x/y/zh-Hans-CN/strings.xml"), "zh-Hans-CN");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathLocaleShort: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[locale]/strings.xml', "x/y/fr/strings.xml"), "fr");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathLanguage: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[language]/strings.xml', "x/y/de/strings.xml"), "de");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathScript: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[language]-[script]/strings.xml', "x/y/zh-Hans/strings.xml"), "zh-Hans");

        test.done();
    },

    testXmlFileTypeGetLocaleFromPathRegion: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[region]/strings.xml', "x/y/JP/strings.xml"), "JP");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[localeDir]/strings.xml', "x/y/de/DE/strings.xml"), "de-DE");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleDirShort: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[localeDir]/strings.xml', "x/y/de/strings.xml"), "de");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleDirLong: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/[localeDir]/strings.xml', "x/y/zh/Hans/CN/strings.xml"), "zh-Hans-CN");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleDirStart: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[localeDir]/strings.xml', "de/DE/strings.xml"), "de-DE");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleUnder: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/strings_[localeUnder].xml', "x/y/strings_de_DE.xml"), "de-DE");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleUnderShort: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/strings_[localeUnder].xml', "x/y/strings_de.xml"), "de");

        test.done();
    },

     testXmlFileTypeGetLocaleFromPathLocaleUnderLong: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.equals(xft.getLocaleFromPath('[dir]/strings_[localeUnder].xml', "x/y/strings_zh_Hans_CN.xml"), "zh-Hans-CN");

        test.done();
    },

     testXmlFileTypeGetMapping1: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.deepEqual(xft.getMapping("x/y/messages.xml"), {
            "schema": "http://www.lge.com/xml/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.xml"
        });

        test.done();
    },

     testXmlFileTypeGetMapping2: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.deepEqual(xft.getMapping("resources/en/US/strings.xml"), {
            "schema": "http://www.lge.com/xml/strings",
            "method": "copy",
            "template": "resources/[localeDir]/strings.xml"
        });

        test.done();
    },

     testXmlFileTypeGetMappingNoMatch: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.getMapping("x/y/msg.jso"));

        test.done();
    },

    testXmlFileTypeHandlesExtensionTrue: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("strings.xml"));

        test.done();
    },

    testXmlFileTypeHandlesExtensionFalse: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("strings.xmlhandle"));

        test.done();
    },

    testXmlFileTypeHandlesNotSource: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("foo.xml"));

        test.done();
    },

    testXmlFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("x/y/z/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesFalseWrongDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("x/y/z/str.jsn"));

        test.done();
    },

    testXmlFileTypeHandlesFalseRightDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("x/y/z/test/str.jsn"));

        test.done();
    },

    testXmlFileTypeHandlesTrueSourceLocale: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("resources/en/US/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesAlternateExtensionTrue: function(test) {
        test.expect(3);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // windows?
        test.ok(xft.handles("strings.jsn"));
        test.ok(xft.handles("strings.jso"));

        test.done();
    },

    testXmlFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!xft.handles("resources/en/GB/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!xft.handles("resources/zh/Hans/CN/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesNotAlreadyLocalizedenUS: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // we figure this out from the template
        test.ok(xft.handles("resources/en/US/messages.xml"));

        test.done();
    },

    testXmlFileTypeRejectInvalidSchema: function(test) {
        test.expect(1);

        test.throws(function(test) {
            var mockproject = {
                getAPI: p.getAPI.bind(p),
                getSourceLocale: p.getSourceLocale.bind(p),
                settings: {
                    locales:["en-GB"],
                    targetDir: "testfiles",
                    nopseudo: true,
                    xml: {
                        schemas: [
                            "./test/testfiles/invalid.json"
                        ],
                        mappings: {
                            "**/invalid.xml": {
                                "schema": "http://github.com/ilib-js/invalid.json",
                                "method": "copy",
                                "template": "resources/invalid_[locale].xml"
                            }
                        }
                    }
                }
            };

            // should throw an exception while trying to parse the invalid.json
            var xft = new XmlFileType(mockproject);
        });

        test.done();
    }
};
