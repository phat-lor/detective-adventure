import { Pagination } from "./Pagination";

interface UserTasks {
	data: Task[];
	meta: Pagination;
}

// export class TaskDto {
// 	@IsString()
// 	@IsNotEmpty()
// 	title: string;
// 	@IsNotEmpty()
// 	@IsString()
// 	description: string;
// 	@IsNotEmpty()
// 	@ValidateNested()
// 	@Type(() => LocationDto)
// 	locations: LocationDto[];
//   }

//   class LocationDto {
// 	@IsString()
// 	placeName: string;
// 	@IsLatitude()
// 	latitude: number;
// 	@IsLongitude()
// 	longitude: number;
//   }

interface Task {
	id: string;
	title: string;
	description: string;
	status?: Status;
	locations: Location[];
	value?: number;
	maxValue?: number;
	centerDefault?: Location;
	zoomDefault?: number;
	createdAt: string;
	updatedAt: string;
}

interface Location {
	id: string;
	placeName: string;
	latitude: number;
	longitude: number;
	cleared?: boolean;
}

enum Status {
	NOT_STARTED = "NOT_STARTED",
	STARTED = "STARTED",
	IN_PROGRESS = "IN_PROGRESS",
	COMPLETED = "COMPLETED",
}

export type { UserTasks, Task };
