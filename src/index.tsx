import * as React from "react";
import * as ReactDOM from "react-dom";
import * as csstips from 'csstips';

csstips.normalize();
csstips.setupPage('body');
import css from './index-style';

interface Data {
  from: string,
  size: number,
  time: number,
  item: {
    [index: string]: Data,
  }
}

type SortableField = 'time' | 'size' | 'name';

interface AppProps {
  data: Data,
}

interface AppState {
  path: string[],
  sortField: SortableField,
  sortAscending: boolean,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: { data: Data }) {
    super(props);
    this.state = {
      path: parsePath(location.hash),
      sortField: 'name',
      sortAscending: true,
    };
  }
  render() {
    let { path, sortField, sortAscending } = this.state;
    let items = data.item;
    for (let x of path) {
      items = items[x].item;
    }
    let sorted = Object.entries(items).sort(this.sorter.bind(this));
    return (
      <div className={css.app}>
        <div>
          <span>
          <a href="#">{data.from}</a>\
          </span>
          {path.map((x, i) => (
            <span key={i}>
              <a href={formatPath(path.slice(0, i + 1))}>{x}</a>\
            </span>
          ))}
        </div>
        <table className={css.files}>
          <thead>
          <tr>
            <th className={css.time} onClick={this.handleSort.bind(this, 'time')}>
              修改时间
              {sortField === 'time' && <SortIndicator ascending={sortAscending} />}
            </th>
            <th className={css.size} onClick={this.handleSort.bind(this, 'size')}>
              大小
              {sortField === 'size' && <SortIndicator ascending={sortAscending} />}
            </th>
            <th className={css.name} onClick={this.handleSort.bind(this, 'name')}>
              名称
              {sortField === 'name' && <SortIndicator ascending={sortAscending} />}
              <CopyIcon
                className={css.copy}
                onClick={(e: Event) => {
                  copyToClipboard(sorted.map(([k]) => [data.from].concat(path).concat([k]).join('\\')).join('\n'));
                  e.stopPropagation();
                }}
              />
            </th>
          </tr>
          </thead>
          <tbody>
          {sorted.map(([k, v]) => (
            <tr key={k}>
              <td className={css.time}>{formatTime(v.time)}</td>
              <td className={css.size}>{formatSize(v.size)}</td>
              <td className={css.name}>
                <a href={v.item && formatPath(path.concat([k]))}>{k}</a>
                <CopyIcon
                  className={css.copy}
                  onClick={() => copyToClipboard([data.from].concat(path).concat([k]).join('\\'))}
                />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        path: parsePath(location.hash),
      });
      if (location.hash.length < 2) {
        history.pushState(null, undefined, location.pathname);
      }
    });
  }
  sorter([k1, v1]: [string, Data], [k2, v2]: [string, Data]): number {
    let { sortField, sortAscending } = this.state;
    let order = sortAscending ? 1 : -1;
    if (sortField === 'name') {
      if ((v1.item === undefined) !== (v2.item === undefined)) {
        return v1.item === undefined ? 1 : -1;
      } else {
        return k1.toLowerCase().localeCompare(k2.toLowerCase()) * order;
      }
    } else {
      return (v1[sortField] - v2[sortField]) * order;
    }
  }
  handleSort(field: SortableField) {
    let { sortField, sortAscending } = this.state;
    this.setState({
      sortField: field,
      sortAscending: sortField !== field || !sortAscending,
    });
  }
}

function formatPath(path: string[]): string {
  return `#${encodeURI(path.join('/'))}`;
}

function parsePath(hash: string): string[] {
  let decoded = decodeURI(hash.slice(1));
  return decoded === '' ? [] : decoded.split('/');
}

let formatTime = (() => {
  function pad(n: number): string {
    return (n < 10 ? '0' : '') + n;
  }
  return function (time: number): string {
    let d = new Date(time * 1000);
    return d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes());
  };
})();

let formatSize = (() => {
  let suffixes = [' B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let sizes = suffixes.map((x, i) => Math.pow(1024, i));
  return function (size: number): string {
    let i = size && Math.floor(Math.log2(size) / 10);
    return Number((size / sizes[i]).toString().slice(0, 4)).toString() + " " + suffixes[i];
  };
})();

function SortIndicator(props: { ascending: boolean }) {
  return (
    <span className={css.sortIndicator}>{props.ascending ? '▲' : '▼'}</span>
  );
}

function CopyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
      <path
        fillRule="evenodd"
        d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9
           1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2
           2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55
           0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"
      />
    </svg>
  );
}

function copyToClipboard(str: string) {
  function listener(e: ClipboardEvent) {
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

declare const data: Data;

document.title = data.from;

let container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App data={data} />, container);
