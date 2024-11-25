// assets
import { DashboardOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'day',
      title: '일사용량 예측 ML',
      type: 'item',
      url: '/day',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'month',
      title: '월별 전력 사용량',
      type: 'item',
      url: '/month',
      icon: icons.ProfileOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
