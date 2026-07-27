const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const cssToAdd = `
        .card-header-compact {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            padding: 4px 0;
        }
        .compact-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 3px solid #10b981;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            flex-shrink: 0;
            color: #10b981;
            background: rgba(0,0,0,0.2);
        }
        .compact-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .compact-address {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            line-height: 1.2;
        }
        .compact-id {
            font-size: 13px;
            color: rgba(255,255,255,0.7);
            display: flex;
            align-items: center;
            gap: 6px;
        }
`;

const cssInsertPoint = content.indexOf('</style>');
if (cssInsertPoint !== -1 && content.indexOf('.compact-circle {') === -1) {
    content = content.substring(0, cssInsertPoint) + cssToAdd + content.substring(cssInsertPoint);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Added CSS');
} else {
    console.log('CSS already exists or </style> not found');
}
