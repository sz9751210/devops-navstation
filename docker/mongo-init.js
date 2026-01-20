// 切換到我們想要的資料庫
db = db.getSiblingDB('devops_nav_db');

// 1. 建立應用程式專用使用者 (Optional but Recommended)
db.createUser({
  user: 'nav_user',
  pwd: 'nav_password',
  roles: [{ role: 'readWrite', db: 'devops_nav_db' }],
});

// 2. 建立 Collection 並插入初始資料
// 這裡的資料結構必須對應 Mongoose Schema
db.createCollection('categories');

db.categories.insertMany([
  {
    id: 'obs',
    title: 'Observability',
    order: 1,
    groups: [
      {
        id: 'metrics',
        title: 'Metrics',
        items: [
          {
            id: 'grafana-main',
            title: 'Grafana Dashboard',
            icon: 'Activity',
            urlTemplate: 'https://grafana.{{base_url}}/d/{{grafana_id}}',
            description: '主要監控面板，包含 API Latency 與 Error Rate',
            tags: ['daily', 'ops', 'critical'],
            visibleIn: [] // 空陣列代表全環境顯示
          }
        ]
      }
    ]
  },
  {
    id: 'cicd',
    title: 'CI/CD & Infra',
    order: 2,
    groups: [
      {
        id: 'jenkins',
        title: 'Pipelines',
        items: [
          {
            id: 'jenkins-master',
            title: 'Jenkins Master',
            icon: 'Hammer',
            urlTemplate: 'https://jenkins.{{base_url}}',
            description: '部署用 Jenkins',
            tags: ['deploy']
          }
        ]
      }
    ]
  }
]);

print('✅ DevOps NavStation Database Initialized Successfully!');