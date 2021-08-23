import {Switch, Route, useRouteMatch} from 'react-router'
import CreateEventPage from './eventCreation/v2/CreateEventPage'
import ManageEventsPage from './eventCreation/v2/ManageEvents'
import EditEventPage from './eventCreation/v2/EditEventPage'
import DeleteEvents from '../../components/DeleteEvents'
import DoorList from '../../components/DoorList'
import ShowingsPage from '../../components/ShowingsPage'
import NewsletterCreate from '../newsletter/NewsletterCreate'
import AdminPanel from './AdminPanel'
import EmailSubscriptions from './EmailSubscriptions'
import ChangePassword from '../../components/ChangePassword'
import ManageAccounts from './ManageAccounts'

export default function AdminSwitch() {
    const { path } = useRouteMatch()
    return <Switch>
        <Route exact path={path}>
            <AdminPanel/>
        </Route>
        <Route path={`${path}/CreateEvents`}>
            <CreateEventPage />
        </Route>
        <Route path={`${path}/ManageEvents`}>
            <ManageEventsPage />
        </Route>
        <Route path={`${path}/EditEvent/:playid`}>
            <EditEventPage />
        </Route>
        <Route path={`${path}/DeleteEvents`}>
            <DeleteEvents />
        </Route>
        <Route exact path={`${path}/doorlist`}>
            <ShowingsPage />
        </Route>
        <Route path={`${path}/doorlist/:showid`}>
            <DoorList />
        </Route>
        <Route path={`${path}/email_subscriptions`}>
            <EmailSubscriptions />
        </Route>
        <Route path={`${path}/newsletter_create`}>
            <NewsletterCreate />
        </Route>
        <Route path={`${path}/changePassword`}>
            <ChangePassword />
        </Route>
        <Route path={`${path}/accountManagement`}>
            <ManageAccounts />
        </Route>
    </Switch>
}
