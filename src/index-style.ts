import { stylesheet } from 'typestyle';

export default stylesheet({
  app: {
    padding: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#333',
    $nest: {
      '& a': {
        textDecoration: 'none',
        color: '#0000a8',
        '&:not([href])': {
          color: '#333',
        }
      }
    },
  },
  files: {
    width: '100%',
    marginTop: '2px',
    lineHeight: '18px',
    borderCollapse: 'collapse',
    $nest: {
      '& thead': {
        borderTop: '1px solid #666',
        borderBottom: '1px solid #666',
      },
      '& tbody tr:first-child td': {
        paddingTop: '1px',
      },
      '& th': {
        color: '#444',
        padding: '3px 6px 1px',
        cursor: 'pointer',
        $nest: {
          '&:hover': {
            color: '#333',
          },
        },
      },
      '& td': {
        padding: '0 6px',
      },
    },
  },
  time: {
    whiteSpace: 'nowrap',
  },
  size: {
    whiteSpace: 'pre',
    "td&": {
      textAlign: 'right',
    },
  },
  name: {
    position: 'relative',
    width: '100%',
    "th&": {
      textAlign: 'left',
    },
  },
  sortIndicator: {
    marginLeft: '2px',
    fontSize: '12px',
    color: '#aaa',
  },
  copy: {
    position: 'absolute',
    display: 'none',
    marginLeft: '6px',
    fill: '#666',
    cursor: 'pointer',
    $nest: {
      'tr:hover &': {
        display: 'inline',
      },
      '&:hover': {
        fill: '#333',
      },
      'th &': {
        top: '2px',
      },
      'td &': {
        top: '-1px',
      },
    },
  },
})
