<template>
  <div id="#output">
    <table>
      <tr>
        <th>
          <select class="form-control" v-model="selectedIdentifier" name="name">
            <option disabled value="">Select one</option>
            <option v-for="idConfig in identifierConfigsByKey" :key="idConfig.name" :value="idConfig.name">
              {{ idConfig.label }}
            </option>
          </select>
        </th>
        <th>
          <input class="form-control" type="text" name="value" id="id-value" v-model.trim="inputValue"
            @keyup.enter=setIdentifier>
        </th>
        <th>
          <button class="form-control" name="set" :disabled="!setButtonEnabled" @click=setIdentifier>Set</button>
        </th>
      </tr>
      <template v-for="(value, name) in  assignedIdentifiers ">
        <tr :key="name" v-if="value">
          <td>{{ identifierConfigsByKey[name].label }}</td>
          <td>{{ value }}</td>
          <td>
            <button class="form-control" @click="removeIdentifier(name)">Remove</button>
          </td>
        </tr>
      </template>
      <tr v-if="assignedIdentifiers['wikidata']">
        <td colspan="3">
          <a href="#" @click.prevent="suggestWikidata">suggest based on Wikidata value</a>
        </td>
      </tr>
      <tr v-if="assignedIdentifiers['viaf']">
        <td colspan="3">
          <a href="#" @click.prevent="suggestViaf">suggest based on viaf value</a>
        </td>
      </tr>
      <template v-for="(suggestion, name) in suggestions">
        <tr :key="'suggest-' + name" v-if="showSuggestion(name)">
          <td>
            {{ identifierConfigsByKey[name].label }}
          </td>
          <td>
            <a targe="_blank"
              :href="identifierConfigsByKey[name].url.replace('@@@', suggestion.value.replaceAll(' ', ''))">{{
                suggestion.value }}</a>
          </td>
          <td><a href="#" @click.prevent="acceptSuggestion(name, suggestion.value)">accept</a></td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
const identifierPatterns = {
  wikidata: /^Q[1-9]\d*$/i,
  isni: /^[0]{4} ?[0-9]{4} ?[0-9]{4} ?[0-9]{3}[0-9X]$/i,
  storygraph: /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i,
  amazon: /^B[0-9A-Za-z]{9}$/,
  youtube: /^@[A-Za-z0-9_\-.]{3,30}/,
}
class SPARQLQueryDispatcher {
  constructor() {
    this.endpoint = 'https://query.wikidata.org/sparql';
  }

  async query(sparqlQuery) {
    const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };

    return fetch(fullUrl, { headers })
      .then(body => body.json())
      .then(json => json.results.bindings[0])

  }
}

export default {
  // Props are for external options; if a subelement of this is modified,
  // the view automatically re-renders
  props: {
    /** The list of ids currently associated with the entity in the database in string form */
    assigned_ids_string: {
      type: String,
      //default: () =>  "{'wikidata': 'Q10000'}"
    },
    /** everything from https://openlibrary.org/config/author
     * Most importantly:
     * {"identifiers": [{"label": "ISNI", "name": "isni", "notes": "", "url": "http://www.isni.org/@@@", "website": "http://www.isni.org/"}, ... ]}
     */
    author_config_string: {
      type: String
    },
    /** see createHiddenInputs function for usage */
    output_selector: {
      type: String
    }
  },

  // Data is for internal stuff. This needs to be a function so that we get
  // a fresh object every time this is initialized.
  data: () => {
    return {
      selectedIdentifier: '', // Which identifier is selected in dropdown
      inputValue: '', // What user put into input
      assignedIdentifiers: {}, // IDs assigned to the entity Ex: {'viaf': '12632978'}
      suggestions: {}
    }
  },

  computed: {
    identifierConfigsByKey: function () {
      // const parsedConfigs = JSON.parse(decodeURIComponent(this.author_config_string))['identifiers'];
      const parsedConfigs = JSON.parse(`{"identifiers": [{"label": "ISNI", "name": "isni", "notes": "", "url": "http://www.isni.org/@@@", "website": "http://www.isni.org/"}, {"label": "LibriVox", "name": "librivox", "notes": "Should be a number", "url": "https://librivox.org/author/@@@", "website": "https://librivox.org"}, {"label": "Project Gutenberg", "name": "project_gutenberg", "notes": "Should be a number", "url": "https://www.gutenberg.org/ebooks/author/@@@", "website": "https://www.gutenberg.org"}, {"label": "VIAF", "name": "viaf", "notes": "", "url": "https://viaf.org/viaf/@@@", "website": "https://viaf.org"}, {"label": "Wikidata", "name": "wikidata", "notes": "", "url": "https://www.wikidata.org/wiki/@@@", "website": "https://wikidata.org"}, {"label": "Amazon ID", "name": "amazon", "notes": "Should be something like B000AQ0842", "url": "https://www.amazon.com/-/e/@@@", "website": "https://www.amazon.com"}, {"label": "Storygraph", "name": "storygraph", "notes": "eg 50b7fbd9-84ac-450d-b2ed-78c861d4ef00", "url": "https://app.thestorygraph.com/authors/@@@", "website": "https://www.thestorygraph.com/"}, {"label": "YouTube", "name": "youtube", "notes": "Link to the author's official YouTube channel", "url": "https://www.youtube.com/@@@", "website": "https://www.youtube.com"}], "key": "/config/author", "type": {"key": "/type/object"}, "latest_revision": 2, "revision": 2, "created": {"type": "/type/datetime", "value": "2021-10-07T20:31:34.001079"}, "last_modified": {"type": "/type/datetime", "value": "2023-08-30T23:32:07.252079"}}`);

      return Object.fromEntries(parsedConfigs.identifiers.map(e => [e.name, e]));
    },
    setButtonEnabled: function () {
      return this.selectedIdentifier !== '' && this.inputValue !== '';
    },
    sparqlQuery: function () {
      return `SELECT ?isni ?viaf ?project_gutenberg ?amazon ?youtube ?librivox ?librarything ?goodreads {
  VALUES ?item {
wd:${this.assignedIdentifiers['wikidata']}
  }
  OPTIONAL { ?item wdt:P213 ?isni. }
  OPTIONAL { ?item wdt:P214 ?viaf. }
  OPTIONAL { ?item wdt:P1938 ?project_gutenberg. }
  OPTIONAL { ?item wdt:P4862 ?amazon. }
  OPTIONAL { ?item wdt:P2963 ?goodreads. }
  OPTIONAL { ?item wdt:P7400 ?librarything. }
  OPTIONAL { ?item wdt:P11245 ?youtube. }
  OPTIONAL { ?item wdt:P1899 ?librivox. }
}
LIMIT 1`;
    },
    viafURL: function () {
      return `https://viaf.org/viaf/${this.assignedIdentifiers['viaf']}/justlinks.json`;
    }
  },
  methods: {
    showSuggestion: function (name) {
      if (this.identifierConfigsByKey.hasOwnProperty(name)) {
        if (this.suggestions[name].value.replaceAll(' ', '') != this.assignedIdentifiers[name]) {
          return true;
        }
      }
      return false;
    },
    setIdentifier: function () {
      // if no identifier selected don't execute
      if (!this.setButtonEnabled) return

      if (this.selectedIdentifier === 'isni') {
        this.inputValue = this.inputValue.replace(/\s/g, '')
      }

      // We use $set otherwise we wouldn't get the reactivity desired
      // See https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
      this.$set(this.assignedIdentifiers, this.selectedIdentifier, this.inputValue);
      this.inputValue = '';
      this.selectedIdentifier = '';
    },
    /** Removes an identifier with value from memory and it will be deleted from database on save */
    removeIdentifier: function (identifierName) {
      this.$set(this.assignedIdentifiers, identifierName, '');
    },
    acceptSuggestion: function (identifierName, identifierValue) {
      this.$set(this.assignedIdentifiers, identifierName, identifierValue.replaceAll(' ', ''));
    },
    createHiddenInputs: function () {
      /** Right now, we have a vue component embedded as a small part of a larger form
        * There is no way for that parent form to automatically detect the inputs in a component without JS
          * This is because the vue component is in a shadow dom
          * So for now this just drops the hidden inputs into the the parent form anytime there is a change
          */
      const html = Object.entries(this.assignedIdentifiers)
        .map(([name, value]) => `<input type="hidden" name="author--remote_ids--${name}" value="${value}"/>`)
        .join('');
      document.querySelector(this.output_selector).innerHTML = html;
    },
    selectIdentifierByInputValue: function () {
      // Selects the dropdown identifier based on the input value when possible
      for (const idtype in identifierPatterns) {
        if (this.inputValue.match(identifierPatterns[idtype])) {
          this.selectedIdentifier = idtype;
          break;
        }
      }
    },
    suggestWikidata: async function () {
      const queryDispatcher = new SPARQLQueryDispatcher();
      this.suggestions = await queryDispatcher.query(this.sparqlQuery);
    },
    suggestViaf: async function () {
      const viafjson = await fetch(this.viafURL).then(body => body.json());
      let suggestions = {};
      if (viafjson.WKP) {
        suggestions.wikidata = { value: viafjson.WKP[0] };
      }
      if (viafjson.ISNI) {
        suggestions.isni = { value: viafjson.ISNI[0].replaceAll(' ', '') };
      }
      this.suggestions = suggestions;
    },
  },
  created: function () {
    this.assignedIdentifiers = {};
  },
  watch: {
    assignedIdentifiers:
    {
      handler: function () { this.createHiddenInputs() },
      deep: true
    },
    inputValue:
    {
      handler: function () { this.selectIdentifierByInputValue() },
    },
  }
}
</script>

<style lang="less">
// This and .form-control ensure that select, input, and buttons are the same height
select.form-control {
  height: calc(2.25rem + 2px);
}

.form-control {
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
}

table {
  background-color: #f6f5ee;
  border-collapse: collapse;
}

th {
  text-align: left;
}

td {
  border-top: 1px solid #ddd;
}

th,
td {
  padding: .25rem;
}
</style>
